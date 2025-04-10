# VectorDoc - Document Search Engine with Vector Embeddings

VectorDoc is a Node.js-based document search engine that uses vector embeddings to enable semantic search capabilities across PDF documents. It features intelligent document ingestion, vector-based similarity search, and cloud storage integration.

## 🚀 Features

- **Document Ingestion**

  - PDF text extraction
  - Vector embedding generation using Hugging Face models
  - Cloud storage with Cloudinary
  - Metadata management

- **Semantic Search**

  - Vector similarity-based search
  - Cosine similarity scoring
  - Paginated results
  - Filter by category and date range

- **API Features**
  - RESTful endpoints
  - File upload support
  - Pagination
  - Error handling
  

## 🛠️ Tech Stack

- Node.js
- Express.js
- MongoDB
- Hugging Face API
- Cloudinary
- PDF Parse
- Multer

## 🔧 Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd VectorDoc
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables in `.env`:

```env
PORT=8080
MONGO_URL=your_mongodb_url
HF_TOKEN=your_huggingface_token
HF_API_URL=your_huggingface_api_url
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
CORS_ORIGIN=*
```

## 📚 API Documentation

### Document Ingestion

```http
POST /api/v1/ingest
Content-Type: multipart/form-data

Request Body:
- docUrl: PDF file
- category: string
```

### Search Documents

```http
GET /api/v1/search
Query Parameters:
- query: Search text
- page: Page number (default: 1)
- limit: Results per page (default: 5)
- category: Filter by category
- startDate: Filter by start date
- endDate: Filter by end date
```

### Get Document by ID

```http
GET /api/v1/document/:id
```

## 🚦 Running the Project

Development mode:

```bash
npm run dev
```

## 📁 Project Structure

```
VectorDoc/
├── controllers/
│   └── document.controller.js
├── middlewares/
│   └── multer.middleware.js
├── models/
│   └── Document.js
├── routes/
│   └── document.routes.js
├── services/
│   └── embeddingService.js
├── utils/
│   ├── cloudinary.js
│   └── textExtractor.js
├── app.js
├── index.js
└── package.json
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Hugging Face for providing the embedding model
- Cloudinary for cloud storage
- MongoDB for database services
