import React, { useEffect, useState } from "react";
import firebase from "firebase";
import { getDefaultNormalizer } from "@testing-library/dom";

var config = firebase.initializeApp({
    apiKey: "AIzaSyALfehV0EWJRiCClk8dNPzfCDqO1nfQCCg",
    authDomain: "shopfor-5ef73.firebaseapp.com",
    projectId: "shopfor-5ef73",
    storageBucket: "shopfor-5ef73.appspot.com",
    messagingSenderId: "1018346297043",
    appId: "1:1018346297043:web:3e36de0336e49836ad2626"
});

const db = config.firestore();

const COLLECTION = "productDetails";

const STORAGE = "productImage";

function Product() {
  const [name, setName] = useState("");
  useEffect(() => console.log(name), [name]);
  const [desc, setDesc] = useState("");
  useEffect(() => console.log(desc), [desc]);
  const [image, setImage] = useState(null);
  useEffect(() => console.log(image), [image]);
  const [isList, setIsList] = useState(false);
  const [productList, setProductList] = useState([]);
  const [images, setImages] = useState([]);
  useEffect(() => {
    productList.map((product) => {
      console.log(images[product.fileName]);
      console.log(images);
      console.log(typeof product.fileName);
      console.log(product);
    });
  });

  useEffect(() => {
    getCollection();
  }, []);

  async function handleButtonCLick() {
    console.log("YHA PHATA");

    let storageRef = firebase.storage().ref(`${STORAGE}/${image.name}`);
    let uploadTask = storageRef.put(image);
    const response = await uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, function () {
      let downloadURL = uploadTask.snapshot.downloadURL;
    });

    await db.collection(COLLECTION).add({
      fileName: image.name,
      name: name,
      desc: desc,
    });

    setIsList(false);

  }

  async function getCollection() {
    const response = db.collection(COLLECTION);
    const data = await response.get();
    console.log("DOCSSSSSSS", data.docs);
    let imageNames = new Set();
    data.docs.forEach((item, i) => {
      const itemData = item.data();
      const itemKey = item.id;
      console.log(itemKey);
      setProductList((prev) => [...prev, { data: itemData, id: itemKey }]);
      imageNames.add(itemData.fileName);
    });
    console.log(imageNames);
    const imageObject = [];
    imageNames.forEach((imageName) => {
      let imageRef = firebase.storage().ref(`${STORAGE}/${imageName}`);
      imageRef
        .getDownloadURL()
        .then((urls) => setImages((prevImg) => [...prevImg, { name: imageName, url: urls }]));
    });
  }

  function onAddClick() {
    console.log("ON ADD CLICK");
    setIsList(true);
  }

  function onDeleteData(data, id) {
    console.log("id", id, "name", data);
    var desertRef = firebase.storage().ref(`${STORAGE}/${data.fileName}`);

    desertRef
      .delete()
      .then(() => {
        db.collection(COLLECTION).doc(id).delete().then(() => {
          console.log("Document successfully deleted!");
          window.location.reload();
      }).catch((error) => {
          console.error("Error removing document: ", error);
      });
      })
      .catch((error) => {
        // Uh-oh, an error occurred!
      });
  }

  return (
    <div>
      {isList ? (
        <div className="app">
          <h1 className="insert-h1">Enter Product Details</h1>
          <input className="insert-input" type="file" onChange={(e) => setImage(e.target.files[0])} />

          <label className="insert-label">Name</label> <br/>
          <input className="insert-input" value={name} onChange={(e) => setName(e.target.value)} /><br/>

          <label className="insert-label">Desc</label><br/>
          <input className="insert-input" value={desc} onChange={(e) => setDesc(e.target.value)} /><br/>
          <button  onClick={handleButtonCLick} classsName="button3">INSERT DATA</button>
        </div>
      ) : (<div className="products"><h1>Products</h1>{
        productList.map(({ data, id }, i) => (
          <div className="app" key={i}>
            <table>
              <tr>
            <td>
            <img
              src={(images.find((image) => "" + image.name === "" + data.fileName) || {}).url}
              alt="AVATAR"
            />
            </td>
            <td>
            <div className="container">
              <h4>
                <b>{data.name}</b>
              </h4>
              <p>{data.desc}</p>
            </div>
            </td>
            <td>
            <button className="button3" onClick={() => onDeleteData(data, id)}>Delete Data</button>
            </td>
            </tr>
            </table>
          </div>
        ))}
        <button className="button4" onClick={onAddClick}>Add Product</button>
      </div>)}
      
    </div>
  );
}

export default Product;