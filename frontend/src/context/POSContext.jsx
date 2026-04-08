import React, { createContext, useContext, useReducer, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getSettings } from "../services/apiSettings";

/* =====================
   Initial State
===================== */

const initialState = {
  cart: [], // [{ id (menuItemId), name, price, quantity, notes }]
  currentOrder: null,

  orderType: "dine-in", // "dine-in" | "takeaway" | "delivery"
  tableNumber: "",
  customerName: "",
  customerEmail: "",
  customerPhone: "",
  deliveryAddress: { fullAddress: "" },

  paymentMethod: "Cash",
  notes: "",

  isCartOpen: true,
  activeCategory: "all",
};

/* =====================
   Reducer
===================== */

function posReducer(state, action) {
  switch (action.type) {
    case "ADD_TO_CART": {
      const existing = state.cart.find((i) => i.id === action.payload.id);
      if (existing) {
        return {
          ...state,
          cart: state.cart.map((i) =>
            i.id === action.payload.id ? { ...i, quantity: i.quantity + 1 } : i
          ),
        };
      }
      return {
        ...state,
        cart: [...state.cart, { ...action.payload, quantity: 1 }],
      };
    }

    case "REMOVE_FROM_CART":
      return {
        ...state,
        cart: state.cart.filter((i) => i.id !== action.payload),
      };

    case "UPDATE_QUANTITY": {
      const { id, quantity } = action.payload;
      if (quantity <= 0) {
        return { ...state, cart: state.cart.filter((i) => i.id !== id) };
      }
      return {
        ...state,
        cart: state.cart.map((i) => (i.id === id ? { ...i, quantity } : i)),
      };
    }

    case "UPDATE_ITEM_NOTES":
      return {
        ...state,
        cart: state.cart.map((i) =>
          i.id === action.payload.id ? { ...i, notes: action.payload.notes } : i
        ),
      };

    case "CLEAR_CART":
      return { ...state, cart: [] };

    case "SET_ORDER_TYPE":
      return { ...state, orderType: action.payload };

    case "SET_TABLE_NUMBER":
      return { ...state, tableNumber: action.payload };

    case "SET_CUSTOMER_NAME":
      return { ...state, customerName: action.payload };

    case "SET_CUSTOMER_EMAIL":
      return { ...state, customerEmail: action.payload };

    case "SET_CUSTOMER_PHONE":
      return { ...state, customerPhone: action.payload };

    case "SET_DELIVERY_ADDRESS":
      return {
        ...state,
        deliveryAddress: { ...state.deliveryAddress, ...action.payload },
      };

    case "SET_PAYMENT_METHOD":
      return { ...state, paymentMethod: action.payload };

    case "SET_NOTES":
      return { ...state, notes: action.payload };

    case "SET_CURRENT_ORDER":
      return { ...state, currentOrder: action.payload };
    case "SET_ACTIVE_CATEGORY":
      return { ...state, activeCategory: action.payload };
    case "RESET_ORDER_INFO":
      return {
        ...state,
        orderType: "dine-in",
        tableNumber: "",
        customerName: "",
        customerEmail: "",
        customerPhone: "",
        deliveryAddress: { fullAddress: "" },
        paymentMethod: "Cash",
        notes: "",
        currentOrder: null,
      };

    default:
      return state;
  }
}

/* =====================
   Context
===================== */

const POSContext = createContext();

/* =====================
   Provider
===================== */

export function POSProvider({ children }) {
  const [state, dispatch] = useReducer(posReducer, initialState);

  const cartTotal = useMemo(
    () => state.cart.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [state.cart]
  );

  const { data: settings } = useQuery({
    queryKey: ["settings"],
    queryFn: getSettings,
  });

  const taxRate = settings?.taxRate || 0;

  const tax = useMemo(() => cartTotal * (taxRate / 100), [cartTotal, taxRate]);
  const total = useMemo(() => cartTotal + tax, [cartTotal, tax]);

  const cartCount = useMemo(
    () => state.cart.reduce((sum, i) => sum + i.quantity, 0),
    [state.cart]
  );

  const addToCart = (item) => dispatch({ type: "ADD_TO_CART", payload: item });
  const removeFromCart = (id) =>
    dispatch({ type: "REMOVE_FROM_CART", payload: id });
  const updateQuantity = (id, quantity) =>
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } });
  const clearCart = () => dispatch({ type: "CLEAR_CART" });

  return (
    <POSContext.Provider
      value={{
        state,
        dispatch,
        cartTotal,
        tax,
        taxRate,
        total,
        cartCount,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </POSContext.Provider>
  );
}

/* =====================
   Hook
===================== */

export function usePOS() {
  const ctx = useContext(POSContext);
  if (!ctx) throw new Error("usePOS must be used within a POSProvider");
  return ctx;
}
