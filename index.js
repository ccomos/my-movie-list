(function () {
  // write your code here
  // new variable
  const BASE_URL = 'https://movie-list.alphacamp.io'
  const INDEX_URL = BASE_URL + '/api/v1/movies/'
  const POSTER_URL = BASE_URL + '/posters/'
  const data = []
  const dataPanel = document.getElementById('data-panel')
  const searchForm = document.getElementById('search')
  const searchInput = document.getElementById('search-input')
  const pagination = document.getElementById('pagination')
  const ITEM_PER_PAGE = 12
  let paginationData = []

  function displayDataList(data) {
    let htmlContent = ''
    data.forEach(function (item, index) {
      htmlContent += `
        <div class="col-sm-3">
          <div class="card mb-2">
            <img class="card-img-top " src="${POSTER_URL}${item.image}" alt="Card image cap">
            <div class="card-body movie-item-body">
              <h6 class="card-title">${item.title}</h6>
            </div>
            <div class="card-footer">
              <button type="button" class="btn btn-primary btn-show-movie" data-id="${item.id}" data-toggle="modal" data-target="#show-movie-modal">
More</button>
              <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
            </div>

          </div>
        </div>
      `
    })
    dataPanel.innerHTML = htmlContent
  }

  function showMovie(id) {
    // get elements
    const modalTitle = document.getElementById('show-movie-title')
    const modalImage = document.getElementById('show-movie-image')
    const modalDate = document.getElementById('show-movie-date')
    const modalDescription = document.getElementById('show-movie-description')

    // set request url
    const url = INDEX_URL + id
    console.log(url)

    // send request to show api
    axios.get(url).then(response => {
      const data = response.data.results
      //console.log(data)

      // insert data into modal ui
      modalTitle.textContent = data.title
      modalImage.innerHTML = `<img src="${POSTER_URL}${data.image}" class="img-fluid" alt="Responsive image">`
      modalDate.textContent = `release at : ${data.release_date}`
      modalDescription.textContent = `${data.description}`
    })
  }

  //加入分頁功能
  function getTotalPages(data) {
    let totalPages = Math.ceil(data.length / ITEM_PER_PAGE) || 1
    let pageItemContent = ''
    for (let i = 0; i < totalPages; i++) {
      pageItemContent += `
        <li class="page-item">
          <a class="page-link" href="javascript:;" data-page="${i + 1}">${i + 1}</a>
        </li>
      `
    }
    pagination.innerHTML = pageItemContent
    //console.log(pagination.innerHTML)
  }

  //listen to pagination click event
  pagination.addEventListener('click', event => {
    console.log(event.target.dataset.page)
    console.log(event.target.tagName)
    if (event.target.tagName === 'A') {
      getPageData(event.target.dataset.page)
    }
  })

  //取出特定page data
  function getPageData(pageNum, data) {
    paginationData = data || paginationData // 若 || 左邊的值能被強制轉為false，則回傳右邊的值，反之則回傳左邊的值
    let offset = (pageNum - 1) * ITEM_PER_PAGE
    let pageData = paginationData.slice(offset, offset + ITEM_PER_PAGE)
    displayDataList(pageData)
  }

  axios.get(INDEX_URL).then((response) => {
    data.push(...response.data.results)
    getTotalPages(data)
    getPageData(1, data)
    //displayDataList(data)

  }).catch((err) => console.log(err))

  dataPanel.addEventListener('click', (event) => {
    if (event.target.matches('.btn-show-movie')) {
      showMovie(event.target.dataset.id)  // modify here
    } else if (event.target.matches('.btn-add-favorite')) {
      addFavoriteItem(event.target.dataset.id)
      //console.log(event.target)
    }
  })

  // listen to search form submit event
  searchForm.addEventListener('submit', event => {
    // 運用 DOM 操作時，通常會使用 JavaScript 來掌控 UI 行為，因此遇到有預設行為(form & button放一起按button預設重新下載頁面)的元件，需要使用 event.preventDefault() 來終止它們的預設行為。
    event.preventDefault()
    // console.log('click!')
    // console.log(searchInput.value)
    //let input = searchInput.value.toLowerCase() //.toLowerCase()把輸入值變成小寫
    // let results = data.filter(
    //   movie => movie.title.toLowerCase().includes(input)
    // )

    //displayDataList(results)

    let results = []
    const regex = new RegExp(searchInput.value, 'i')

    results = data.filter(movie => movie.title.match(regex))
    console.log(results)
    // displayDataList(results)
    getTotalPages(results)
    getPageData(1, results)
  })

  //加入最愛的電影
  function addFavoriteItem(id) {
    const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
    const movie = data.find(item => item.id === Number(id))

    if (list.some(item => item.id === Number(id))) {
      alert(`${movie.title} is already in your favorite list.`)
    } else {
      list.push(movie)
      alert(`Added ${movie.title} to your favorite list!`)
    }
    localStorage.setItem('favoriteMovies', JSON.stringify(list))
  } //local storage 裡的 value 是 string type，也就是存入 data 時需要呼叫 JSON.stringify(obj)，而取出時需要呼叫 JSON.parse(value)
  //若使用者是第一次使用收藏功能，則 localStorage.getItem('favoriteMovies') 會找不到東西，所以需要建立一個空 Array。
  //data.find(item => item.id === Number(id)) 是從電影總表中找出 id 符合條件的電影物件，find 可以依條件檢查 Array，並且回傳第一個符合條件的值。
  //從 HTML 取出的 id 會是 string type，而經過 JSON.parse 之後的 id 會是 number type，所以使用 === 的時候要小心。
  //list.some(item => item.id === Number(id)) 用來判斷是否清單中已有相同的電影，如果沒有則會新增。some 則可以依條件檢查 Array 後回傳 boolean。





})()