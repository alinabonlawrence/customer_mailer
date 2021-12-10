import {
  AppProvider,
  Avatar,
  Button,
  Card,
  Heading,
  Page,
  ResourceList,
  Stack,
  TextContainer,
  TextStyle,
} from "@shopify/polaris";
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

  let customer_data = customers.map((customer) => {
    // return <p key={customer.id}>{customer.email}</p>;
    return {
      id: customer.id,
      firstName: customer.first_name,
      lastName: customer.last_name,
      email: customer.email,
    };
  });
  // console.log(customer_data);

  // Fetch ko yung each products then push ko sya sa array para magsama
  let products = [];
  orders.map((order) => {
    return order.line_items.map((items) => products.push(items.name));
  });
  // console.log(products);
  // output
  // ['Samsung M2', 'Samsung M2', 'Redragon M1', 'Redragon M2', 'Samsung M1', 'Samsung M2', "Redragon Monitor 23' in", '24" SF354 LED Monitor', '24" SF354 LED Monitor']

  // then count ko yung mga duplicates
  let product_list_count = [];
  products.forEach((product) => {
    product_list_count[product] = (product_list_count[product] || 0) + 1;
  });
  // console.log(product_list_count);
  //output
  // [Samsung M2: 3, Redragon M1: 1, Redragon M2: 1, Samsung M1: 1, Redragon Monitor 23' in: 1, …]
  // PROBLEM!!! ayaw ma arrange ng 2nd at 3rd item pa descending :(

  //get ko yung top 3 products
  let top_products_obj = Object.entries(product_list_count).slice(0, 3);

  //get ko yung name ng product
  let top_products_list = top_products_obj.map((product) => {
    return product[0];
  });

  // console.log(top_products_obj);
  // console.log(top_products_list);

  // send email sa tanan customers
  const sendEmail = async () => {
    customers.map((customer) => {
      let email = customer.email;
      if (email !== null) {
        authAxios
          .post("/sendEmail", {
            email: email,
            top_product: top_products_list,
          })
          .then((result) => console.log(result.data))
          .catch((error) => console.log(error.response));
      } else {
        console.log("Customer no email");
      }
    });
  };

  //send individual email
  const send_single_mail = async (single_email) => {
    if (single_email !== null) {
      authAxios
        .post("/sendEmail", {
          email: single_email,
          top_product: top_products_list,
        })
        .then((result) => {
          if (result.data) {
            console.log(result.data);
          }
        })
        .catch((error) => console.log(error.response));
      console.log(single_email);
    } else {
      console.log("Customer no email");
    }
  };

  return (
    <Page>
      <Stack alignment="center" spacing="extraLoose">
        <Stack.Item fill>
          <Heading>Customer List</Heading>
        </Stack.Item>
        <Stack.Item>
          <Button monochrome outline onClick={sendEmail}>
            Send Email
          </Button>
        </Stack.Item>
      </Stack>
      {/* <div style="margin-top: 10px"></div> */}
      <AppProvider
        i18n={{
          Polaris: {
            ResourceList: {
              sortingLabel: "Sort by",
              defaultItemSingular: "item",
              defaultItemPlural: "items",
              showing: "Showing {itemsCount} {resource}",
              Item: {
                viewItem: "View details for {itemName}",
              },
            },
            Common: {
              checkbox: "checkbox",
            },
          },
        }}
      >
        <Card>
          <ResourceList
            showHeader
            items={customer_data}
            renderItem={(item) => {
              const { id, firstName, lastName, email } = item;
              const media = <Avatar size="medium" name={firstName} />;

              return (
                <ResourceList.Item id={id} media={media}>
                  <Stack>
                    <Stack.Item fill>
                      <h3>
                        <TextStyle variation="strong">
                          {lastName} {firstName}
                        </TextStyle>
                      </h3>
                      <div>{email}</div>
                    </Stack.Item>
                    <Stack.Item>
                      <Button onClick={() => send_single_mail(email)}>
                        Send Email
                      </Button>
                    </Stack.Item>
                  </Stack>
                </ResourceList.Item>
              );
            }}
          />
        </Card>
      </AppProvider>
    </Page>
  );
}

export default index;
