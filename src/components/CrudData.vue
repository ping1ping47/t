<template>
  <div id="app" class="container mx-auto px-4">
    <h4 class="text-lg font-semibold mb-4">Product Management</h4>

    <!-- Add Product Button -->
    <button @click="openAddModal" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4">Add
      Product</button>

    <!-- Product Table -->
    <div class="mb-8">
      <table class="w-full table-auto">
        <thead>
          <tr class="bg-gray-200">
            <th v-for="(column, columnIndex) in columns" :key="columnIndex" class="px-4 py-2">{{ column }}</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(product, productIndex) in products.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)"
            :key="productIndex" class="bg-white">
            <td v-for="(column, columnIndex) in columns" :key="columnIndex" class="px-4 py-2 text-center">
              <template v-if="column === 'Index'">{{ productIndex + 1 }}</template>
              <template v-else-if="column === 'Product Name'">{{ product.prod_name }}</template>
              <template v-else-if="column === 'Product Description'">{{ product.prod_desc }}</template>
              <template v-else-if="column === 'Product Price'">{{ product.prod_price }}</template>
              <template v-else>
                <a href="#!" class="text-blue-500 hover:text-blue-700"
                  @click="openEditModal((currentPage - 1) * itemsPerPage + productIndex)">Edit</a>
                <span class="mx-1">|</span>
                <a href="#!" class="text-red-500 hover:text-red-700"
                  @click="showDeleteConfirmation((currentPage - 1) * itemsPerPage + productIndex)">Delete</a>
              </template>
            </td>
          </tr>
          <tr v-if="products.length === 0">
            <td :colspan="columns.length" class="px-4 py-2 text-center">No products available</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Delete confirmation modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white p-8 rounded-lg shadow-lg">
        <p class="text-lg font-semibold mb-4">Are you sure you want to delete this product?</p>
        <div class="flex justify-end">
          <button @click="deleteProduct"
            class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Delete</button>
          <button @click="closeDeleteModal"
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-4">Cancel</button>
        </div>
      </div>
    </div>

    <!-- Add product modal -->
    <div v-if="showAddModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white p-8 rounded-lg shadow-lg">
        <h4 class="text-lg font-semibold mb-4">Add Product</h4>
        <div class="mb-4">
          <label for="addName" class="block text-gray-700 font-semibold mb-2">Product Name:</label>
          <input type="text" id="addName" v-model="input.prod_name"
            class="w-full border rounded-lg py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
        </div>
        <div class="mb-4">
          <label for="addDesc" class="block text-gray-700 font-semibold mb-2">Product Description:</label>
          <textarea id="addDesc" v-model="input.prod_desc"
            class="w-full border rounded-lg py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"></textarea>
        </div>
        <div class="mb-4">
          <label for="addPrice" class="block text-gray-700 font-semibold mb-2">Product Price:</label>
          <input type="text" id="addPrice" v-model="input.prod_price"
            class="w-full border rounded-lg py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
        </div>
        <div class="flex justify-end">
          <button @click="addProduct"
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Add</button>
          <button @click="closeAddModal"
            class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-4">Cancel</button>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div class="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
      <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p class="text-sm text-gray-700">
            Showing <span class="font-medium">{{ firstItemIndex }}</span> to <span class="font-medium">{{ lastItemIndex
              }}</span> of <span class="font-medium">{{ totalItems }}</span> results
          </p>
        </div>
        <div>
          <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
            <a href="#"
              class="relative inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-inset ring-gray-300 focus:outline-offset-0 bg-gray-200 text-gray-800 rounded-l-md"
              @click="previousPage" :disabled="currentPage === 1">
              <span class="sr-only">Previous</span>
              Previous
              <ChevronLeftIcon class="h-5 w-5" aria-hidden="true" />
            </a>
            <template v-for="page in visiblePages" :key="page">
              <a :href="`#${page}`" @click="goToPage(page)" :aria-current="page === currentPage ? 'page' : null"
                class="relative inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-inset ring-gray-300 focus:outline-offset-0 bg-gray-200 text-gray-800"
                :class="{ 'bg-indigo-600 text-white': page === currentPage, 'hover:bg-gray-300': page !== currentPage }">
                {{ page }}
              </a>
            </template>
            <a href="#"
              class="relative inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-inset ring-gray-300 focus:outline-offset-0 bg-gray-200 text-gray-800 rounded-r-md"
              @click="nextPage" :disabled="currentPage === totalPages">
              Next
              <span class="sr-only">Next</span>
              <ChevronRightIcon class="h-5 w-5" aria-hidden="true" />
            </a>
          </nav>
        </div>

      </div>
    </div>
  </div>
</template>



<script>
export default {
  data() {
    return {
      columns: ['Index', 'Product Name', 'Product Description', 'Product Price', 'Actions'],
      products: [],
      input: {
        prod_name: "",
        prod_desc: "",
        prod_price: ""
      },
      editInput: {
        prod_name: "",
        prod_desc: "",
        prod_price: ""
      },
      showDeleteModal: false,
      showAddModal: false,
      showEditModal: false,
      deleteIndex: null,
      editIndex: null,
      currentPage: 1,
      itemsPerPage: 10,
      items: [] // Your items array goes here
    };
  },

  computed: {
    visiblePages() {
      const totalVisiblePages = 10; // จำนวนหน้าที่ต้องการแสดง
      const startPage = Math.max(1, this.currentPage - Math.floor(totalVisiblePages / 2));
      const endPage = Math.min(this.totalPages, startPage + totalVisiblePages - 1);

      return Array(endPage - startPage + 1).fill().map((_, index) => startPage + index);
    },
    firstItemIndex() {
      return (this.currentPage - 1) * this.itemsPerPage + 1;
    },
    lastItemIndex() {
      return Math.min(this.currentPage * this.itemsPerPage, this.totalItems);
    },
    totalItems() {
      return this.products.length; // เปลี่ยนจาก this.items เป็น this.products เนื่องจากข้อมูลมาจาก this.products ครับ
    },
    totalPages() {
      return Math.ceil(this.totalItems / this.itemsPerPage);
    }
  },
  mounted() {
    this.fetchProducts();
  },
  methods: {
    previousPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.fetchProducts(); // เพิ่มเรียก fetchProducts เมื่อเปลี่ยนหน้า
      }
    },
    // ฟังก์ชันสำหรับไปยังหน้าถัดไป
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
        this.fetchProducts(); // เพิ่มเรียก fetchProducts เมื่อเปลี่ยนหน้า
      }
    },
    // ฟังก์ชัน fetchProducts ถูกเรียกเมื่อหน้าถูกเปลี่ยน
    fetchProducts() {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = this.currentPage * this.itemsPerPage;

      fetch('http://localhost:3000/products')
        .then(response => response.json())
        .then(data => {
          // แทนที่ข้อมูลใน products ด้วยข้อมูลที่โหลดมาใหม่
          this.products = data;

          // แก้ไขเป็นการ slice ข้อมูลตาม startIndex และ endIndex
          this.items = this.products.slice(startIndex, endIndex);
        })
        .catch(error => {
          console.error('Error fetching products:', error);
        });
    },
    showDeleteConfirmation(index) {
      this.deleteIndex = index;
      this.showDeleteModal = true;
    },
    closeDeleteModal() {
      this.showDeleteModal = false;
    },
    deleteProduct() {
      const index = this.deleteIndex;
      const productId = this.products[index]._id;
      fetch(`http://localhost:3000/products/${productId}`, {
        method: 'DELETE'
      })
        .then(() => {
          this.products.splice(index, 1);
          this.showDeleteModal = false;
        })
        .catch(error => {
          console.error('Error deleting product:', error);
        });
    },
    openEditModal(index) {
      this.editIndex = index;
      this.editInput = { ...this.products[index] };
      this.showEditModal = true;
    },
    closeEditModal() {
      this.showEditModal = false;
    },
    updateProduct() {
      const index = this.editIndex;
      const productId = this.products[index]._id;
      fetch(`http://localhost:3000/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(this.editInput),
      })
        .then(response => response.json())
        .then(updatedProduct => {
          this.products.splice(index, 1, updatedProduct);
          this.showEditModal = false;
        })
        .catch(error => {
          console.error('Error updating product:', error);
        });
    },
    openAddModal() {
      this.showAddModal = true;
    },
    closeAddModal() {
      this.showAddModal = false;
    },
    addProduct() {
      fetch('http://localhost:3000/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(this.input),
      })
        .then(response => response.json())
        .then(newProduct => {
          this.products.push(newProduct);
          this.showAddModal = false;
        })
        .catch(error => {
          console.error('Error adding product:', error);
        });
    }
  }
};
</script>
