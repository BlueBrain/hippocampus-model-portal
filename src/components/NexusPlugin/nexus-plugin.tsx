import React from 'react';
import { NexusClient, Resource } from '@bbp/nexus-sdk';
import { Result } from 'antd';

import { basePath } from '../../config';


const PluginError: React.FC = () => (
  <Result
    status="warning"
    title="Plugin failed to render"
    subTitle="This issue has been reported to devolopers"
  />
);

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
  }

  async loadExternalPlugin() {
    if (!this.container.current) return;

    const pluginManifest = await fetch(`${basePath}/plugins/manifest.json`)
      .then(res => res.json());

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
            ref: HTMLDivElement;
            nexusClient?: NexusClient;
            resource: Resource;
          }) => () => void;
        }) => {
          this.setState({
            error: null,
            loading: false,
          });
          this.destroyPlugin = pluginModule.default({
            ref: this.container.current!,
            nexusClient: this.props.nexusClient,
            resource: this.props.resource,
          });
        },
      )
      .catch((error: Error) => {
        this.setState({ error, loading: false });
      });
  }

  componentDidCatch(error: Error) {
    this.setState({ error, loading: false });
  }

  componentDidUpdate(prevProps: NexusPluginClassProps) {
    if (
      prevProps.resource !== this.props.resource
      || prevProps.name !== this.props.name
    ) {
      if (this.destroyPlugin) {
        this.destroyPlugin();
        this.destroyPlugin = null;
      }

      this.setState({ error: null, loading: true });
      this.loadExternalPlugin();
    }
  }

  componentDidMount() {
    this.loadExternalPlugin();
  }

  componentWillUnmount() {
    if (this.destroyPlugin && typeof this.destroyPlugin === 'function') {
      this.destroyPlugin();
    }
  }

  render() {
    const className = this.props.className || '';

    return (
      <div>
        <div
          className={`remote-component ${className}`}
          ref={this.container}
        />
        {this.state.error && (
          <PluginError />
        )}
      </div>
    );
  }
}

export default NexusPlugin;
