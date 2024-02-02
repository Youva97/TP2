const express = require("express");
// const helmet = require("helmet");

const app = express();

/* app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"], // Ajoutez ici 'unsafe-inline' pour les styles
        imgSrc: ["'self'"],
        // ... autres directives CSP ...
      },
    },
  })
); */
const path = require("path");
const port = 8000;
const bodyParser = require("body-parser");

let { Eta } = require("eta");
let viewpath = path.join(__dirname, "views");
let eta = new Eta({ views: viewpath, cache: false });

app.use(express.static(path.join(__dirname, "assets")));

let products = [
  {
    "id": 1,
    name: "Cryptage Email Pro",
    description:
      "Logiciel de cryptage avancé pour sécuriser les communications par email.",
    type: "email",
    image: "img/cryptage.jpg", // Chemin relatif depuis l'emplacement de votre fichier JavaScript
  },
  {
    id: 2,
    name: "Guardian Data Suite",
    description:
      "Suite complète de cryptage pour protéger les fichiers et les données stockées.",
    type: "fichier",
    image: "img/data.jpg", // Chemin relatif depuis l'emplacement de votre fichier JavaScript
  },
  {
    id: 3,
    name: "Secure Chat Messenger",
    description:
      "Application de messagerie sécurisée avec cryptage de bout en bout.",
    type: "messagerie",
    image: "img/network.jpg", // Chemin relatif depuis l'emplacement de votre fichier JavaScript
  },
  {
    id: 4,
    name: "Network Encryptor",
    description:
      "Solution de cryptage réseau pour sécuriser les communications d'entreprise.",
    type: "réseau",
    image: "img/secure.jpg", // Chemin relatif depuis l'emplacement de votre fichier JavaScript
  },
  {
    id: 5,
    name: "Mobile Security App",
    description:
      "Application mobile pour le cryptage de données et la communication sécurisée.",
    type: "mobile",
    image: "img/cryptage.jpg", // Chemin relatif depuis l'emplacement de votre fichier JavaScript
  },
  {
    id: 6,
    name: "Cloud Protector",
    description:
      "Outil de cryptage pour sécuriser les données stockées dans le cloud.",
    type: "cloud",
    image: "img/data.jpg", // Chemin relatif depuis l'emplacement de votre fichier JavaScript
  },
  {
    id: 7,
    name: "Virtual Private Network",
    description:
      "VPN avec cryptage avancé pour naviguer et transmettre des données en toute sécurité.",
    type: "vpn",
    image: "/img/network.jpg", // Chemin relatif depuis l'emplacement de votre fichier JavaScript
  },
  {
    id: 8,
    name: "Digital Safe",
    description:
      "Coffre-fort numérique pour le stockage sécurisé de documents sensibles.",
    type: "stockage",
    image: "img/secure.jpg", // Chemin relatif depuis l'emplacement de votre fichier JavaScript
  },
  {
    id: 9,
    name: "Enterprise Security Manager",
    description:
      "Solution de gestion de la sécurité pour les grandes entreprises, intégrant le cryptage de données.",
    type: "gestion",
    image: "img/network.jpg", // Chemin relatif depuis l'emplacement de votre fichier JavaScript
  },
  {
    id: 10,
    name: "Personal Data Shield",
    description:
      "Logiciel de cryptage personnel pour la protection des données sur les appareils personnels.",
    type: "personnel",
    image: "img/cryptage.jpg", // Chemin relatif depuis l'emplacement de votre fichier JavaScript
  },
];

let types = [];
for (let i = 0; i < products.length; i++) {
  if (!types.includes(products[i].type)) {
    types.push(products[i].type);
  }
}
console.log("🚀 ~ types:", types)


app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send(eta.render("index.eta", { title: "Homepage" }));
});

app.get("/qui-sommes-nous", (req, res) => {
  res.send(
    eta.render("whoweare.eta", { title: "Qui sommes-nous", page: "whoweare" })
  );
});

app.get("/contact", (req, res) => {
  res.send(
    eta.render("contact.eta", { title: "Contactez-nous", page: "contact" })
  );
});

app.get("/nos-produits", (req, res) => {
  let productsNew = products;
  if (req.query.type) {
    productsNew = products.filter((p) => p.type == req.query.type);
  }
  res.send(
    eta.render("products.eta", {
      title: "Nos produits",
      page: "products",
      products: productsNew,
      types: types,
    })
  );
});



app.get("/nos-produits/:id", (req, res) => {
  const productId = parseInt(req.params.id);
  const product = products.find((p) => p.id === productId);

  if (product) {
    res.send(
      eta.render("product-details.eta", {
        title: "Détail du produit",
        page: "product-details",
        product,
      })
    );
  } else {
    res.redirect("/");
  }
});


app.get("/nos-produits/edit/:id", (req, res) => {
  let product = products.find((p) => p.id == req.params.id);

  if (!product){
    product = {
      id: 0,
      name: '',
      description: '',
      type: '',
    };
    products.push(product.id);
  }
  res.send(
    eta.render("product-form.eta", {
      title: "Creation / Modification",
      page: "Creation / Modification",
      product: product,
    })
  );
});


app.post("/nos-produits/edit/:id", (req, res) => {
  const productId = parseInt(req.params.id);
  const { name, description } = req.body;
  const productIndex = products.findIndex((p) => p.id === productId);

  if (productIndex !== -1) {
    products[productIndex].name = name;
    products[productIndex].description = description;
  } else {
    let idMax = products.reduce((acc, item) => {
      return Math.max(acc, item.id);
    }, 0);
    const newProduct = products.length + 1;
    products.push({ id: newProduct, name, description });
  }
  res.redirect(`/nos-produits`);
});


app.get("/nos-produits/delete/:id", (req, res)=> {
  const productId = parseInt(req.params.id);
  products = products.filter((product)=> product.id !== productId);
  res.redirect("/nos-produits");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
