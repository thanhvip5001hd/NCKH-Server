class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }
  // query: câu truy vấn mongoose
  // queryString: chuỗi truy vấn

  // 1. Filter
  filter() {
    // a. Filtering (Lọc cơ bản)

    const queryObj = { ...this.queryString };

    const exculdeFields = ["page", "sort", "limit", "fields"];

    exculdeFields.forEach((el) => delete queryObj[el]);
    // console.log(req.query, queryObj);

    // b. Advanced Filtering (lọc nâng cao)

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    console.log(JSON.parse(queryStr));

    // let query = Tour.find(JSON.parse(queryStr));
    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  // 2. Sorting
  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
      // (sắp xếp theo tên trường)
    } else {
      this.query = this.query.sort("-createdAt");
    }

    return this;
  }

  // 3. Field limited
  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v");
      // select('-field'): chọn ra tất cả các phần tử trừ field đó
    }

    return this;
  }

  // 4.Phân trang (Pagination)
  paginate() {
    // page=2&limit=10
    // 1-10: nằm ở trang 1
    // 11-20: nằm ở trang 2

    const page = this.queryString.page * 1 || 1;
    // * 1 để đổi chuỗi thành số
    // (viết a || b => b là giá trị mặc định của biến page)

    const limit = this.queryString.limit * 1 || 100;

    // Ta có trang 3 là từ 21-30 => tức (3-1)*10 => skip 20 kết quả
    // => công thức skip = (page - 1)*limit

    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = APIFeatures;
