import React from 'react';
import Breadcrumb from './components/ui/molecule/breadcrumb';

const longPages = [
  { name: 'HEFTI Homepage', href: '#', current: false },
  { name: 'All Nursing Homes', href: '#', current: false },
  { name: 'Aspen Point Health and Rehabilitation', href: '#', current: false },
  { name: 'Report Builder', href: '#', current: true },
];

function App() {
  return (
    <div className="">
      <Breadcrumb pages={longPages} />
    </div>
  );
}

export default App;
