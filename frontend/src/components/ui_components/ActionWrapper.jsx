export default function ActionWrapper({ children }) {
  return <div onClick={(e) => e.stopPropagation()}>{children}</div>;
}
