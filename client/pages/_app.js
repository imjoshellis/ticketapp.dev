import 'bootstrap/dist/css/bootstrap.css'

export const App = ({ Component, pageProps }) => (
  <div className='container'>
    <Component {...pageProps} />
  </div>
)

export default App
