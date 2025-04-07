const Blog = require("../models/Blog");

// Create a new blog with image upload
exports.createBlog = async (req, res) => {
  try {
    const { title, blogHeading, blogDescription, blogContent } = req.body;

    // Get uploaded file paths
    const bannerImage = req.files["bannerImage"]
      ? `/uploads/${req.files["bannerImage"][0].filename}`
      : "";
    const img1 = req.files["img1"]
      ? `/uploads/${req.files["img1"][0].filename}`
      : "";
    const img2 = req.files["img2"]
      ? `/uploads/${req.files["img2"][0].filename}`
      : "";

    // Create blog entry
    const newBlog = new Blog({
      title,
      bannerImage,
      img1,
      img2,
      blogHeading,
      blogDescription,
      blogContent,
    });

    await newBlog.save();
    res.status(201).json(newBlog);
  } catch (error) {
    res.status(500).json({ message: "Error creating blog", error });
  }
};

exports.getLatestBlog = async (req, res) => {
  const { id } = req.params;
  try {
    let latestBlog = null;
    if (id === "new") {
      latestBlog = await Blog.findOne().sort({ createdAt: -1 }); // Get the latest blog
    } else {
      latestBlog = await Blog.findById(id);
    }
    if (!latestBlog) {
      return res.status(404).json({ message: "No blogs found" });
    }
    res.json(latestBlog);
  } catch (err) {
    console.error("Error fetching latest blog:", err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.randomThreeBlogs = async (req, res) => {
  try {
    const randomBlogs = await Blog.aggregate([{ $sample: { size: 3 } }]); // Get 3 random blogs

    if (!randomBlogs.length) {
      return res.status(404).json({ message: "No blogs available" });
    }

    res.status(200).json(randomBlogs);
  } catch (err) {
    console.error("Error fetching random blogs:", err);
    res.status(500).json({ error: "Server error" });
  }
};
