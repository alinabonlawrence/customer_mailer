import { Button } from "@shopify/polaris";
import React, { useEffect, useState } from "react";

function index({ authAxios }) {
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loadData, setLoadData] = useState(true);

  useEffect(() => {
    authAxios
      .get("/customers")
      .then((result) => {
        if (result !== 0 || result !== undefined) {
          setCustomers(result.data.body.customers);
        } else {
          return "No customer data";
        }
      })
      .catch((error) => console.log(error));

    authAxios
      .get("/orders")
      .then((result) => {
        if (result !== 0 || result !== undefined) {
          setOrders(result.data.body.orders);
        } else {
          return "No orders data";
        }
      })
      .catch((error) => console.log(error));

    setLoadData(loadData);
  }, [loadData]);

  const customer = customers.map((customer) => {
    return <p key={customer.id}>{customer.email}</p>;
  });

  let products = [];
  orders.map((order) => {
    return order.line_items.map((items) => products.push(items.name));
  });

  let product_list_count = [];
  let maxCount = 0;
  let maxValue;

  products.forEach((product) => {
    product_list_count[product] = (product_list_count[product] || 0) + 1;
  });

  let top_products_obj = Object.entries(product_list_count).slice(0, 3);
  let top_products_list = top_products_obj.map((product) => {
    return product[0];
  });

  console.log(product_list_count);
  console.log(top_products_obj);
  console.log(top_products_list);

  const sendEmail = async () => {
    customers.map((customer) => {
      let email = customer.email;
      email !== null &&
        authAxios
          .post("/sendEmail", {
            email: email,
            top_product: top_products_list,
          })
          .then((result) => console.log(result))
          .catch((error) => console.log(error));
    });
  };

  return (
    <div>
      <Button onClick={sendEmail}>Send Email</Button>
      {customer}
    </div>
  );
}

export default index;
