export const printReceipt = (order, storeName) => {
  const win = window.open("", "_blank");
  if (!win) return;
  win.document.write(`
    <html><body>
    <h2>${storeName}</h2>
    <p>Order #${order._id}</p>
    </body></html>
  `);
  win.document.close();
  win.print();
};
