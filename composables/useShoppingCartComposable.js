export const useShoppingCartComposable = () => {
  const shoppingCart = useCart().value;
  const { $awn } = useNuxtApp();
  const lang = useCookie("lang").value;

  const addToCart = (item) => {
    // Check if the item is already in the cart
    if (!shoppingCart.items.hasOwnProperty(item.id)) {
      // Initialize the stored item with qty set to 1
      let storedItem = reactive({
        id: item.id,
        qty: 1, // Start with a quantity of 1 when adding a new item
        price: item.price,
        item: item,
        photo: item.productImageUrl,
      });

      // Add the new item to the cart
      Object.assign(shoppingCart.items, {
        [item.id]: storedItem,
      });
      shoppingCart.totalQty += 1; // Increase the quantity by one
      shoppingCart.totalPrice += item.price; // Update total price
    } else {
      // Item is already in the cart; just update the quantity and total price
      shoppingCart.items[item.id]["qty"] += 1; // Increment the quantity
      shoppingCart.totalQty += 1; // Increase the total quantity
      shoppingCart.totalPrice += item.price; // Update total price
    }

    resetCartToStorage(shoppingCart);
    lang == "en"
      ? $awn.success("Product has been added to the cart")
      : $awn.success("تم أضافة المنتج بنجاح");
  };

  const addToCartWithQty = (item, qty) => {
    if (shoppingCart.items.hasOwnProperty(item.id)) {
      updateQty(item.id, qty);
    } else {
      addToCart(item);
      updateQty(item.id, qty);
    }
  };

  const updateQty = (id, qty) => {
    if (shoppingCart.items.hasOwnProperty(id)) {
      // Update total quantities and prices
      shoppingCart.totalQty -= shoppingCart.items[id]["qty"]; // Remove old quantity
      shoppingCart.totalPrice -=
        shoppingCart.items[id]["qty"] * shoppingCart.items[id]["price"]; // Remove old price
      shoppingCart.items[id]["qty"] = qty; // Set new quantity
      shoppingCart.totalQty += qty; // Add new quantity
      shoppingCart.totalPrice += qty * shoppingCart.items[id]["price"]; // Add new price
      resetCartToStorage(shoppingCart);
    }
  };

  const removeItemFromCart = (id) => {
    if (shoppingCart.items.hasOwnProperty(id)) {
      // Decrease total quantities and prices
      shoppingCart.totalQty -= shoppingCart.items[id]["qty"]; // Remove item quantity
      shoppingCart.totalPrice -=
        shoppingCart.items[id]["qty"] * shoppingCart.items[id]["price"]; // Remove item price
      // Delete the item from the cart
      delete shoppingCart.items[id];
      resetCartToStorage(shoppingCart);
      lang == "en"
        ? $awn.success("Product has been removed from cart")
        : $awn.success("تم حذف المنتج بنجاح");
    }
  };

  const resetCartToStorage = (value) => {
    localStorage.setItem("cart", JSON.stringify(value));
  };

  return {
    addToCart,
    addToCartWithQty,
    updateQty,
    removeItemFromCart,
  };
};
