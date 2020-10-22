import 'bootstrap/dist/css/bootstrap.css'
import buildClient from '../api/buildClient'
import Header from '../components/header'

export const App = ({ Component, pageProps, currentUser }) => (
  <>
    <Header currentUser={currentUser} />
    <section className='container'>
      <Component {...pageProps} />
    </section>
  </>
)

App.getInitialProps = async appContext => {
  const client = buildClient(appContext.ctx)
  const {
    data: { currentUser }
  } = await client.get('/api/users/currentuser')
  let pageProps = {}
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(appContext.ctx)
  }

  return { pageProps, currentUser }
}

export default App
