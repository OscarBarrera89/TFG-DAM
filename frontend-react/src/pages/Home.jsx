import { Outlet } from 'react-router';
import Menu from '../components/Menu';
import Footer from '../components/Footer';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';

function Home() {

  return (
    <>
      <Menu />
      <Outlet />
      <Footer />
    </>
  );
}

export default Home;
