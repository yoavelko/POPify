import React, { useState } from 'react';
import ShoppingCartIcon from '../media/carticon.svg';

function CartIcon() {
  const [itemCount, setItemCount] = useState(0);

  const handleAddItem = () => {
    setItemCount(itemCount + 1);
  };
  return (
    <div onClick={handleAddItem}>
      <ShoppingCartIcon />
      <span>{itemCount}</span>
    </div>
  );
}

export default CartIcon;