const bcrypt = require("bcryptjs");
const Users = require("../api/models/Users");
const Items = require("../api/models/Items");
require("dotenv").config();

const createUsers = async () => {
  console.log("Creating 15 default users...");

  const userData = [
    {
      name: "david",
      email: "david@hawk.iit.edu",
      password: "Test12345!",
      phone: "1112223333",
    },
    {
      name: "bob",
      email: "bob@hawk.iit.edu",
      password: "Test12345!",
      phone: "1112224444",
    },
    {
      name: "george",
      email: "george@hawk.iit.edu",
      password: "Test12345!",
      phone: "1112225555",
    },
    {
      name: "williams",
      email: "williams@hawk.iit.edu",
      password: "Test12345!",
      phone: "1112226666",
    },
    {
      name: "andy",
      email: "andy@hawk.iit.edu",
      password: "Test12345!",
      phone: "1112227777",
    },
    {
      name: "chris",
      email: "chris@hawk.iit.edu",
      password: "Test12345!",
      phone: "1112228888",
    },
    {
      name: "brian",
      email: "brian@hawk.iit.edu",
      password: "Test12345!",
      phone: "1112229999",
    },
    {
      name: "richard",
      email: "richard@hawk.iit.edu",
      password: "Test12345!",
      phone: "1112220000",
    },
    {
      name: "alex",
      email: "alwx@hawk.iit.edu",
      password: "Test12345!",
      phone: "1112221111",
    },
    {
      name: "henry",
      email: "henry@hawk.iit.edu",
      password: "Test12345!",
      phone: "1113334444",
    },
    {
      name: "harry",
      email: "harry@hawk.iit.edu",
      password: "Test12345!",
      phone: "1113335555",
    },
    {
      name: "emily",
      email: "emily@hawk.iit.edu",
      password: "Test12345!",
      phone: "1113336666",
    },
    {
      name: "elizabeth",
      email: "elizabeth@hawk.iit.edu",
      password: "Test12345!",
      phone: "1114447777",
    },
    {
      name: "susan",
      email: "susan@hawk.iit.edu",
      password: "Test12345!",
      phone: "1114448888",
    },
    {
      name: "summer",
      email: "summer@hawk.iit.edu",
      password: "Test12345!",
      phone: "1114449999",
    },
  ];

  const itemData = [
    {
      name: "Dev Ops",
      status: "Available",
      category: "Books",
      price: 10,
      location: "MSV",
      description: "used",
      sellerID: "",
      photo: [
        "https://images-eu.ssl-images-amazon.com/images/I/51Z6uQ57ilL._SY291_BO1,204,203,200_QL40_ML2_.jpg",
      ],
    },
    {
      name: "IIT T-Shirt",
      status: "Available",
      category: "Clothing",
      price: 15,
      location: "Stuart",
      description: "used",
      sellerID: "",
      photo: [
        "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcShGkNZI9DnPJkhua7jr5zl9WExp-AQCI-jA7lgfDCae7_mmz6X&usqp=CAU",
      ],
    },
    {
      name: "Bike",
      status: "Available",
      category: "Rental",
      price: 5,
      location: "Library",
      description: "used",
      sellerID: "",
      photo: [
        "https://vader-prod.s3.amazonaws.com/1580160482-haro-beasley-1580160464.jpg",
      ],
    },
    {
      name: "PS4",
      status: "Available",
      category: "Electronics",
      price: 100,
      location: "Parking D2",
      description: "used",
      sellerID: "",
      photo: [
        "https://images-na.ssl-images-amazon.com/images/I/71jN27mYlhL._SX466_.jpg",
      ],
    },
    {
      name: "Razer Mouse",
      status: "Available",
      category: "Electronics",
      price: 30,
      location: "MSV",
      description: "used",
      sellerID: "",
      photo: [
        "https://images-na.ssl-images-amazon.com/images/I/81g1xQK-llL._AC_SL1500_.jpg",
      ],
    },
    {
      name: "HP Printer",
      status: "Available",
      category: "Electronics",
      price: 100,
      location: "SSV",
      description: "used",
      sellerID: "",
      photo: [
        "https://store.hp.com/app/assets/images/uploads/prod/hps-smallest-laser-printer-hero1560955405015547.jpg",
      ],
    },
    {
      name: "Razer Keyboard",
      status: "Available",
      category: "Electronics",
      price: 100,
      location: "IIT Tower",
      description: "used",
      sellerID: "",
      photo: [
        "https://assets2.razerzone.com/images/cynosa-chroma-pro-gallery-2017/CynosaChromaPro_OGimage-1200x630.jpg",
      ],
    },
    {
      name: "iPhone 11 Pro",
      status: "Available",
      category: "Electronics",
      price: 800,
      location: "Tech South",
      description: "used",
      sellerID: "",
      photo: [
        "https://cdn0.vox-cdn.com/hermano/verge/product/image/9171/akrales_190914_3666_0048_squ.jpg",
      ],
    },
    {
      name: "iPad Pro",
      status: "Available",
      category: "Electronics",
      price: 900,
      location: "Parking D2",
      description: "used",
      sellerID: "",
      photo: [
        "https://icdn2.digitaltrends.com/image/digitaltrends/ipad-pro-2018-review-5848-1200x630-c-ar1.91.jpg",
      ],
    },
    {
      name: "Gaming PC",
      status: "Available",
      category: "Electronics",
      price: 1000,
      location: "Tech North",
      description: "used",
      sellerID: "",
      photo: [
        "https://images.idgesg.net/images/article/2018/01/ces18_pho_016_origindesktops-100746738-large.jpg",
      ],
    },
    {
      name: "Yamaha Motorbike",
      status: "Available",
      category: "Vehicle",
      price: 5000,
      location: "Parking A1",
      description: "used",
      sellerID: "",
      photo: [
        "https://media.zigcdn.com/media/model/2020/Mar/yamaha-yzf-r15-v3-right-side-view_360x240.jpg",
      ],
    },
    {
      name: "Rice Cooker",
      status: "Available",
      category: "Supplies",
      price: 30,
      location: "SSV",
      description: "used",
      sellerID: "",
      photo: [
        "https://i.insider.com/5d260d6fa17d6c0e5e3a4e81?width=1136&format=jpeg",
      ],
    },
    {
      name: "Desk",
      status: "Available",
      category: "Funitures",
      price: 100,
      location: "Parking D2",
      description: "used",
      sellerID: "",
      photo: [
        "https://img.letgo.com/images/33/1b/f4/7e/331bf47ebd23c8faf573f880c7557503.jpg?impolicy=img_600",
      ],
    },
    {
      name: "lamp",
      status: "Available",
      category: "Funitures",
      price: 10,
      location: "Parking B2",
      description: "used",
      sellerID: "",
      photo: [
        "https://images-na.ssl-images-amazon.com/images/I/51vT8t%2B8YqL._AC_SX466_.jpg",
      ],
    },
    {
      name: "Supreme Bag",
      status: "Available",
      category: "Clothing",
      price: 200,
      location: "Tech Center",
      description: "used",
      sellerID: "",
      photo: [
        "https://stockx.imgix.net/products/streetwear/Supreme-Shoulder-Bag-SS18-Black.jpg?fit=fill&bg=FFFFFF&w=700&h=500&auto=format,compress&q=90&dpr=2&trim=color&updated_at=1539203847",
      ],
    },
    {
      name: "Supreme Sweater",
      status: "Available",
      category: "Clothing",
      price: 200,
      location: "Tech Center",
      description: "used",
      sellerID: "",
      photo: [
        "https://i.pinimg.com/originals/0c/e1/af/0ce1af6f563c325d42b41262ee9c69d9.jpg",
      ],
    },
    {
      name: "Hair Dryer",
      status: "Available",
      category: "Electronics",
      price: 30,
      location: "MSV",
      description: "used",
      sellerID: "",
      photo: [
        "https://hips.hearstapps.com/vader-prod.s3.amazonaws.com/1543533629-hairdryer11-1543533619.png",
      ],
    },
    {
      name: "Yeezy",
      status: "Available",
      category: "Clothing",
      price: 200,
      location: "Library",
      description: "used",
      sellerID: "",
      photo: ["https://cdn.flightclub.com/PRODUCT/3037658/1.jpg?w="],
    },
    {
      name: "Mattress",
      status: "Available",
      category: "Funitures",
      price: 100,
      location: "SSV",
      description: "used",
      sellerID: "",
      photo: [
        "https://productimages.mybobs.com/fit-in/624x0/sp/20026379/20026379_hero_wide.jpg",
      ],
    },
    {
      name: "USB Hub",
      status: "Available",
      category: "Electronics",
      price: 200,
      location: "Crown Hall",
      description: "used",
      sellerID: "",
      photo: [
        "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcS7iKPyRn37nf61G6z00LQzhb1a_8n0VhEgNu9WtsMqsB1rx_VR&usqp=CAU",
      ],
    },
    {
      name: "ASUS ROG Router",
      status: "Available",
      category: "Electronics",
      price: 150,
      location: "Commons Hall",
      description: "used",
      sellerID: "",
      photo: [
        "https://i.pcmag.com/imagery/reviews/02Jds97whQwZpjeGcIsWr22-17..v_1569472348.jpg",
      ],
    },
    {
      name: "Paints",
      status: "Available",
      category: "Supplies",
      price: 20,
      location: "Crown Hall",
      description: "used",
      sellerID: "",
      photo: [
        "https://www.sallybeauty.com/dw/image/v2/BCSM_PRD/on/demandware.static/-/Sites-SBS-SallyBeautySupply/default/dw8a80f356/images/large/WELLA2.jpg?sw=750&sh=750&sfrm=png",
      ],
    },
    {
      name: "Jacket",
      status: "Available",
      category: "Clothing",
      price: 100,
      location: "MSV",
      description: "used",
      sellerID: "",
      photo: [
        "https://images-na.ssl-images-amazon.com/images/I/71vpN1h03PL._AC_UY679_.jpg",
      ],
    },
    {
      name: "Macbook Air",
      status: "Available",
      category: "Electronics",
      price: 600,
      location: "Stuart",
      description: "used",
      sellerID: "",
      photo: [
        "https://cnet3.cbsistatic.com/img/KEM_0EsoAP-9kOds2Fbal9Ww540=/1200x675/2017/08/14/ec0fa893-faf2-46c3-8933-6898773804ba/apple-macbook-air-2017-05.jpg",
      ],
    },
    {
      name: "Calculus Book",
      status: "Available",
      category: "Books",
      price: 100,
      location: "Library",
      description: "used",
      sellerID: "",
      photo: [
        "https://images.ezvid.com/image/upload/fl_immutable_cache/e_trim/c_pad,f_auto,h_270,q_auto:eco/jrauvhcq17q66t8nwhcx",
      ],
    },
    {
      name: "Mountain Bike",
      status: "Available",
      category: "Vehicles",
      price: 200,
      location: "Parking B1",
      description: "used",
      sellerID: "",
      photo: [
        "https://surlybikes.com/uploads/bikes/_medium_image/Krampus-suspension-fork_BK2116-2000x1333.jpg",
      ],
    },
    {
      name: "Sony Camera",
      status: "Available",
      category: "Electronics",
      price: 1200,
      location: "MSV",
      description: "used",
      sellerID: "",
      photo: [
        "https://images-na.ssl-images-amazon.com/images/I/71ETsX1pjgL._AC_SL1200_.jpg",
      ],
    },
    {
      name: "Vizio TV",
      status: "Available",
      category: "Electronics",
      price: 250,
      location: "Tech North",
      description: "used",
      sellerID: "",
      photo: [
        "https://cnet2.cbsistatic.com/img/63_TZqTRVAVST-kI_FCfReUVQhc=/1200x675/2019/06/07/495a521f-2783-4aa0-888a-6123b844ec73/vizio-m-series-quantum05.jpg",
      ],
    },
    {
      name: "LG Monitor",
      status: "Available",
      category: "Electronics",
      price: 200,
      location: "Tech South",
      description: "used",
      sellerID: "",
      photo: [
        "https://www.bhphotovideo.com/images/images2500x2500/lg_32gk65b_b_32_uhd_gaming_monitor_1478385.jpg",
      ],
    },
    {
      name: "Table",
      status: "Available",
      category: "Funitures",
      price: 40,
      location: "SSV",
      description: "used",
      sellerID: "",
      photo: [
        "https://cb2.scene7.com/is/image/CB2/DylanDineTbl53X36inSHF18_1x1",
      ],
    },
  ];

  _dummyData(userData, itemData);
};

async function _dummyData(userData, itemData, userIndex = 0, itemIndex = 0) {
  if (userIndex >= userData.length) return;
  if (itemIndex >= itemData.length) return;
  let user = userData[userIndex];
  const found = await Users.findOne({ email: user.email });
  if (found) {
    console.log(`user ${user.email} already exists!`);
    return await _dummyData(userData, itemData, ++userIndex, itemIndex);
  }
  const newUser = new Users(user);
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(newUser.password, salt);
  newUser.password = hash;
  newUser.save(async (err, res) => {
    let item = itemData[itemIndex];
    item.sellerID = res._id.toString();
    await _createItems(item);
    itemIndex++;

    item = itemData[itemIndex];
    item.sellerID = res._id.toString();
    await _createItems(item);
    itemIndex++;
    await _dummyData(userData, itemData, ++userIndex, itemIndex);
  });
}

async function _createItems(item) {
  const found = await Items.findOne({ name: item.name });
  if (found) return console.log(`Item ${item.name} already exists!`);
  const newItem = new Items(item);
  newItem.save();
}

exports.createUsers = createUsers;
