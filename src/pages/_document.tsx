import Document, { Html, Head, Main, NextScript } from 'next/document'

import { basePath } from '../config';


class AppDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          {/* eslint-disable-next-line @next/next/no-sync-scripts */}
          <script type="systemjs-importmap" src={`${basePath}/systemjs-importmap.json`}></script>
        </Head>

        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}


export default AppDocument;
