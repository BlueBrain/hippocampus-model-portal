import * as React from "react";
import invariant from "ts-invariant";
import isFunction from "lodash/isFunction";
import { NexusClient, Resource } from "@bbp/nexus-sdk";
import { basePath } from "@/config";
// import { Result } from 'antd';

// import Loading from '../components/Loading';

const PluginError: React.FC<{ error: Error }> = ({ error }) => {
  return (
    <p>Plugin failed to render</p>
    // <Result
    //   status="warning"
    //   title="Plugin failed to render"
    //   subTitle={error.message}
    // />
  );
};

const warningMessage =
  "SystemJS not found. " +
  "To load plugins, Nexus Web requires SystemJS to be available globally." +
  " You can find out more here https://github.com/systemjs/systemjs";

export type NexusPluginProps<T> = {
  name: string;
  resource: Resource<T>;
  className?: string;
};

export type NexusPluginClassProps<T = any> = NexusPluginProps<T> & {
  nexusClient: NexusClient;
};

export class NexusPlugin extends React.Component<
  NexusPluginClassProps,
  { error: Error | null; loading: boolean }
> {
  private container: React.RefObject<HTMLDivElement>;
  private destroyPlugin: (() => void) | null;

  constructor(props: NexusPluginClassProps) {
    super(props);
    this.state = { error: null, loading: true };
    this.container = React.createRef();
    this.destroyPlugin = null;
    // @ts-ignore
    invariant(window.System, warningMessage);
  }

  async loadExternalPlugin() {
    if (!this.container.current) return;

    const pluginManifest = await fetch(
      `${basePath}/plugins/manifest.json`
    ).then((res) => res.json());

    const { modulePath } = pluginManifest[this.props.name];
    const moduleUrl = `${basePath}/plugins/${modulePath}`;

    // @ts-ignore
    window.System.import(moduleUrl)
      .then(
        (pluginModule: {
          default: ({
            ref,
            nexusClient,
            resource,
          }: {
            ref: HTMLDivElement | null;
            nexusClient?: NexusClient;
            resource: Resource;
          }) => () => void;
        }) => {
          this.setState({
            error: null,
            loading: false,
          });
          this.destroyPlugin = pluginModule.default({
            ref: this.container.current,
            nexusClient: this.props.nexusClient,
            resource: this.props.resource,
          });
        }
      )
      .catch((error: Error) => {
        console.log(error);
        this.setState({ error, loading: false });
      });
  }

  componentDidCatch(error: Error) {
    this.setState({ error, loading: false });
  }

  // eslint-disable-next-line react/no-deprecated
  componentWillUpdate(prevProps: NexusPluginClassProps) {
    // Reload the plugin(and pass in new props to it) when props change
    // NOTE: will not reload the plugin if nexusClient or goToResource changes
    // otherwise it will cause too many reloads
    if (
      prevProps.resource !== this.props.resource ||
      prevProps.name !== this.props.name
    ) {
      this.loadExternalPlugin();
    }
  }

  componentDidMount() {
    this.loadExternalPlugin();
  }

  componentWillUnmount() {
    if (this.destroyPlugin && isFunction(this.destroyPlugin)) {
      this.destroyPlugin();
    }
  }

  render() {
    const className = this.props.className || "";

    return (
      <div className={` ${className}`} ref={this.container} />
      // <Loading
      //   size="big"
      //   loading={this.state.loading}
      //   loadingMessage={<h3>Loading {this.props.pluginName || 'Plugin'}</h3>}
      // >
      //   {this.state.error ? (
      //     <PluginError error={this.state.error} />
      //   ) : (
      //     <div className="remote-component" ref={this.container}></div>
      //   )}
      // </Loading>
    );
  }
}

export default NexusPlugin;
