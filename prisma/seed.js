const bcrypt =require("bcryptjs")
const { PrismaClient } = require("@prisma/client");
const { category } = require("../src/configs/prisma");
const prisma = new PrismaClient();

const hashedPassword = bcrypt.hashSync("123456",10);

const courseData = [
    {
      title: "JavaScript Basics",
      description: "Learn the fundamentals of JavaScript.",
      price: 1000,
      instructor: "John Doe",
      length: "2 hours",
      videoURL: "https://www.youtube.com/watch?v=2yJgwwDcgV8",
      categoryId: 1,
      thumbnails: "https://res.cloudinary.com/dwdyih5ih/image/upload/v1743084873/Introduction-to-JavaScript-with-complete-Guide-1_amg4ht.jpg"
    },
    {
      title: "React for Beginners",
      description: "Introduction to React and component-based development.",
      price: 1000,
      instructor: "Jane Smith",
      length: "3 hours",
      videoURL: "https://www.youtube.com/watch?v=2yJgwwDcgV8",
      categoryId: 1,
      thumbnails: "https://res.cloudinary.com/dwdyih5ih/image/upload/v1743083757/react-img21_r4dkoi.png"

    },
    {
      title: "Node.js & Express",
      description: "Build backend applications using Node.js and Express.",
      price: 1000,
      instructor: "Alice Johnson",
      length: "4 hours",
      videoURL: "https://www.youtube.com/watch?v=2yJgwwDcgV8",
      categoryId: 1,
      thumbnails: "https://res.cloudinary.com/dwdyih5ih/image/upload/v1743083764/nodejs_ek6lem.png"
      
    },
    {
      title: "Database Design with MySQL",
      description: "Learn how to design efficient databases with MySQL.",
      price: 1000,
      instructor: "Bob Brown",
      length: "2.5 hours",
      videoURL: "https://www.youtube.com/watch?v=2yJgwwDcgV8",
      categoryId: 1,
      thumbnails:  "https://res.cloudinary.com/dwdyih5ih/image/upload/v1743084927/mysql_shahxb.jpg"
    },
    {
      title: "TypeScript Essentials",
      description: "Master TypeScript for scalable applications.",
      price: 1000,
      instructor: "Charlie Lee",
      length: "3.5 hours",
      videoURL: "https://www.youtube.com/watch?v=2yJgwwDcgV8",
      categoryId: 1,
      thumbnails: "https://res.cloudinary.com/dwdyih5ih/image/upload/v1743085043/typescript_y5xylm.webp"
    },
    {
      title: "GraphQL API Development",
      description: "Build powerful APIs with GraphQL and Apollo Server.",
      price: 1000,
      instructor: "David Kim",
      length: "5 hours",
      videoURL: "https://www.youtube.com/watch?v=2yJgwwDcgV8",
      categoryId: 1,
      thumbnails: "https://res.cloudinary.com/dwdyih5ih/image/upload/v1743085218/graphql-crash-course-cover_q11s6i.png"
    },
    {
      title: "Docker & Kubernetes",
      description: "Deploy applications using Docker and Kubernetes.",
      price: 1000,
      instructor: "Emma White",
      length: "4 hours",
      videoURL: "https://www.youtube.com/watch?v=2yJgwwDcgV8",
      categoryId: 1,
      thumbnails: "https://res.cloudinary.com/dwdyih5ih/image/upload/v1743085262/bcg_docker_banner_axw30h.png"
    },
    {
      title: "Next.js Full-Stack Development",
      description: "Learn Next.js for server-side rendering and full-stack apps.",
      price: 1000,
      instructor: "Frank Black",
      length: "6 hours",
      videoURL: "https://www.youtube.com/watch?v=2yJgwwDcgV8",
      categoryId: 1,
      thumbnails: "https://res.cloudinary.com/dwdyih5ih/image/upload/v1743085311/NEXT-js-tutorial-1_z0vmbo.png"
    },
    {
      title: "Python for Web Development",
      description: "Use Python and Django for full-stack web development.",
      price: 1000,
      instructor: "Grace Green",
      length: "5.5 hours",
      videoURL: "https://www.youtube.com/watch?v=2yJgwwDcgV8",
      categoryId: 1,
      thumbnails: "https://res.cloudinary.com/dwdyih5ih/image/upload/v1743085367/bcg_python_banner_u63kyk.png"
    },
    {
      title: "AI & Machine Learning Basics",
      description: "Introduction to AI and ML with Python.",
      price: 1000,
      instructor: "Henry Wilson",
      length: "7 hours",
      videoURL: "https://www.youtube.com/watch?v=2yJgwwDcgV8",
      categoryId: 1,
      thumbnails: "https://res.cloudinary.com/dwdyih5ih/image/upload/v1743085450/ai_o2m4te.jpg"
    }
  ];

const userData = [
  {
    firstname: "John",
    lastname: "Doe",
    email: "john.doe@example.com",
    password: hashedPassword,
    role: "USER",
  },
  {
    firstname: "Jane",
    lastname: "Smith",
    email: "jane.smith@example.com",
    password: hashedPassword,
    role: "USER",
  },
  {
    firstname: "Alice",
    lastname: "Johnson",
    email: "alice.johnson@example.com",
    password: hashedPassword,
    role: "USER",
  },
  {
    firstname: "Bob",
    lastname: "Brown",
    email: "bob.brown@example.com",
    password: hashedPassword,
    role: "USER",
  },
  {
    firstname: "Charlie",
    lastname: "Davis",
    email: "charlie.davis@example.com",
    password: hashedPassword,
    role: "USER",
  },
  {
    firstname: "David",
    lastname: "Evans",
    email: "david.evans@example.com",
    password: hashedPassword,
    role: "USER",
  },
  {
    firstname: "Emma",
    lastname: "Wilson",
    email: "emma.wilson@example.com",
    password: hashedPassword,
    role: "USER",
  },
  {
    firstname: "Frank",
    lastname: "Moore",
    email: "frank.moore@example.com",
    password: hashedPassword,
    role: "USER",
  },
  {
    firstname: "Grace",
    lastname: "Taylor",
    email: "grace.taylor@example.com",
    password: hashedPassword,
    role: "USER",
  },
  {
    firstname: "Henry",
    lastname: "Anderson",
    email: "henry.anderson@example.com",
    password: hashedPassword,
    role: "USER",
  },
]

  async function run() {

    try {
  
      // Assuming you have a "Course" model in your schema
  
      // const result = await prisma.course.createMany({
      //   data: courseData
  
      // });
      const resultUser = await prisma.user.createMany({
      data: userData,
      skipDuplicates: true,
      })
      console.log(`Created ${resultUser.count} courses`);
  
    } catch (error) {
  
      console.error("Error:", error);
  
    } finally {
  
      await prisma.$disconnect();
  
    }
  
  }
  
  run();