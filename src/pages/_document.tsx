import Document, { Html, Head, Main, NextScript } from 'next/document'


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

          <script
            type="systemjs-importmap"
            dangerouslySetInnerHTML={{
              __html: `{
                "imports": {
                  "react": "https://unpkg.com/react@17.0.2/umd/react.production.min.js",
                  "react-dom": "https://unpkg.com/react-dom@17.0.2/umd/react-dom.production.min.js"
                }
              }`
            }}
          />

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
