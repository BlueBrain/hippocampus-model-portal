import Document, { Html, Head, Main, NextScript } from 'next/document'

import { basePath } from '../config';


class AppDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Titillium+Web:wght@300;400;700&display=swap"
          />

          <link rel="shortcut icon" href="https://www.hippocampushub.eu/favicon.ico" />

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
