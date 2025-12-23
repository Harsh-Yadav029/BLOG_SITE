import cloudinary from "../config/cloudinary.js"
import { handleError } from "../helpers/handleError.js"
import Blog from "../models/blog.model.js"
import { encode } from 'entities'
import Category from "../models/category.model.js"

export const addBlog = async (req, res, next) => {
  try {
    const data = JSON.parse(req.body.data)
    let featuredImage = ""

    /* ✅ FIX:
       Using multer.memoryStorage()
       → req.file.path DOES NOT exist
       → must upload using buffer + upload_stream
    */
    if (req.file) {
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "yt-mern-blog",
            resource_type: "image"
          },
          (error, result) => {
            if (error) return reject(error)
            resolve(result)
          }
        )

        stream.end(req.file.buffer) // ✅ buffer upload
      })

      featuredImage = uploadResult.secure_url
    }

    const blog = new Blog({
      author: data.author,
      category: data.category,
      title: data.title,
      slug: `${data.slug}-${Math.round(Math.random() * 100000)}`,
      featuredImage,
      blogContent: encode(data.blogContent)
    })

    await blog.save()

    res.status(200).json({
      success: true,
      message: "Blog added successfully."
    })
  } catch (error) {
    next(handleError(500, error.message))
  }
}


export const editBlog = async (req, res, next) => {
    try {
        const { blogid } = req.params
        const blog = await Blog.findById(blogid).populate('category', 'name')
        if (!blog) {
            next(handleError(404, 'Data not found.'))
        }
        res.status(200).json({
            blog
        })
    } catch (error) {
        next(handleError(500, error.message))
    }
}

export const updateBlog = async (req, res, next) => {
  try {
    const { blogid } = req.params
    const data = JSON.parse(req.body.data)

    const blog = await Blog.findById(blogid)
    if (!blog) {
      return next(handleError(404, "Blog not found"))
    }

    blog.category = data.category
    blog.title = data.title
    blog.slug = data.slug
    blog.blogContent = encode(data.blogContent)

    let featuredImage = blog.featuredImage

    /* ✅ SAME FIX HERE */
    if (req.file) {
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "yt-mern-blog",
            resource_type: "image"
          },
          (error, result) => {
            if (error) return reject(error)
            resolve(result)
          }
        )
        stream.end(req.file.buffer)
      })

      featuredImage = uploadResult.secure_url
    }

    blog.featuredImage = featuredImage
    await blog.save()

    res.status(200).json({
      success: true,
      message: "Blog updated successfully."
    })
  } catch (error) {
    next(handleError(500, error.message))
  }
}

export const deleteBlog = async (req, res, next) => {
  try {
    const { blogid } = req.params
    await Blog.findByIdAndDelete(blogid)
    res.status(200).json({
      success: true,
      message: "Blog deleted successfully."
    })
  } catch (error) {
    next(handleError(500, error.message))
  }
}


export const showAllBlog = async (req, res, next) => {
  try {
    const user = req.user
    const blog =
      user.role === "admin"
        ? await Blog.find()
            .populate("author", "name avatar role")
            .populate("category", "name slug")
            .sort({ createdAt: -1 })
            .lean()
        : await Blog.find({ author: user._id })
            .populate("author", "name avatar role")
            .populate("category", "name slug")
            .sort({ createdAt: -1 })
            .lean()

    res.status(200).json({ blog })
  } catch (error) {
    next(handleError(500, error.message))
  }
}

export const getBlog = async (req, res, next) => {
    try {
        const { slug } = req.params
        const blog = await Blog.findOne({ slug }).populate('author', 'name avatar role').populate('category', 'name slug').lean().exec()
        res.status(200).json({
            blog
        })
    } catch (error) {
        next(handleError(500, error.message))
    }
}

export const getRelatedBlog = async (req, res, next) => {
    try {
        const { category, blog } = req.params

        const categoryData = await Category.findOne({ slug: category })
        if (!categoryData) {
            return next(404, 'Category data not found.')
        }
        const categoryId = categoryData._id
        const relatedBlog = await Blog.find({ category: categoryId, slug: { $ne: blog } }).lean().exec()
        res.status(200).json({
            relatedBlog
        })
    } catch (error) {
        next(handleError(500, error.message))
    }
}

export const getBlogByCategory = async (req, res, next) => {
    try {
        const { category } = req.params

        const categoryData = await Category.findOne({ slug: category })
        if (!categoryData) {
            return next(404, 'Category data not found.')
        }
        const categoryId = categoryData._id
        const blog = await Blog.find({ category: categoryId }).populate('author', 'name avatar role').populate('category', 'name slug').lean().exec()
        res.status(200).json({
            blog,
            categoryData
        })
    } catch (error) {
        next(handleError(500, error.message))
    }
}
export const search = async (req, res, next) => {
    try {
        const { q } = req.query

        const blog = await Blog.find({ title: { $regex: q, $options: 'i' } }).populate('author', 'name avatar role').populate('category', 'name slug').lean().exec()
        res.status(200).json({
            blog,
        })
    } catch (error) {
        next(handleError(500, error.message))
    }
}

export const getAllBlogs = async (req, res, next) => {
    try {
        const user = req.user
        const blog = await Blog.find().populate('author', 'name avatar role').populate('category', 'name slug').sort({ createdAt: -1 }).lean().exec()
        res.status(200).json({
            blog
        })
    } catch (error) {
        next(handleError(500, error.message))
    }
}
