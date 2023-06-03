import { BrowserRouter, Routes , Route } from 'react-router-dom';
import './App.css';
// import backgroundImage from './back.jpg'
import Home from './components/Home';
import Register from './components/Register'
import Login from './components/Login'
import Error from './components/Error';
import ForgetPassword from './components/ForgetPassword'

import AProduct from './components/admin/Product'
import AUser from './components/admin/User'
import AComplaint from './components/admin/Complaint'
import ADashboard from './components/admin/Dashboard'
import AOrder from './components/admin/Order'

import CBid from './components/customer/Bid'
import CCart from './components/customer/Cart'
import CProductInquiry from './components/customer/ProductInquiry'
import COrder from './components/customer/Order'
import CProduct from './components/customer/Product'
import CDashboard from './components/customer/Dashboard';

import SBid from './components/seller/Bid'
import SOrder from './components/seller/Order'
import SProduct from './components/seller/Product'
import SProductInquiry from './components/seller/ProductInquiry'
import SDashboard from './components/seller/Dashboard';

function App() {


  return (
    
    <div className="App" >
      {/* <h1>Hello this is me</h1> */}
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="forgetPassword" element={<ForgetPassword />} />
        <Route path="register" element={<Register />} />
        <Route path='admin' element={<ADashboard />}>
          <Route index element={<AProduct />} />
          <Route path="user" element={<AUser />} />
          <Route path='order' element={<AOrder />} />
          <Route path="complaint" element={<AComplaint/>} />
        </Route>
        <Route path='seller' element={<SDashboard />} >
          <Route index element={<SProduct />} />
          <Route path="order" element={<SOrder />} />
          <Route path="productInquiry" element={<SProductInquiry />} />
          <Route path='bid' element={<SBid />} />
        </Route>
        <Route path='customer' element = {<CDashboard/>}>
          <Route index element={<CProduct />} />
          <Route path="order" element={<COrder />} />
          <Route path="cart" element={<CCart />} />
          <Route path='bid' element={<CBid />} />
          <Route path='inquiry' element={<CProductInquiry />} />
        </Route>
        <Route path='*' element = {<Error />} />
      </Routes>
    </BrowserRouter>
    </div>
  );
}

export default App;
