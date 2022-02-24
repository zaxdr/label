import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import store from '@/stores/index'
import './index.less';
import 'antd/dist/antd.variable.min.css';
import HomeComponent from './views/home';
ReactDOM.render(
  <Provider store={store}>
    <HomeComponent />
  </Provider>,
  document.getElementById('root'));


