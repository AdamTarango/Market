const prisma = require("../prisma");
const seed = async (numProds=20) => {
  products = []
  for (i=0; i<numProds; i++){
    products.push({ 
      title: `product ${i}`,
      description: `descritpion of product ${i}`,
      price: 6
     })
  }
  await prisma.product.createMany({ data : products })
  
};
seed()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });