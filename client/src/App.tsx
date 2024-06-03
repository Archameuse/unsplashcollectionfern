import './App.css';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Search } from './pages/Search';
import { ImageDetails } from './pages/ImageDetails';
import { Collections } from './pages/Collections';
import { Collection } from './pages/Collection';

function App() {
  return (
    <Routes>
      <Route element={<Layout />} path='/'>
        <Route index element={<Home/>}/>
        <Route path='/search' element={<Search/>}/> 
        <Route path='/images/:id' element={<ImageDetails/>}/>
        <Route path='/collections' element={<Collections/>}/>
        <Route path='/collections/:id' element={<Collection/>}/>
        <Route path='*' element={<Navigate to='/'/>}/>
      </Route>
    </Routes>
  );
}

export default App;