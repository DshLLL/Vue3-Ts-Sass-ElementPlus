import {
  defineComponent,
  nextTick,
  ref,
  reactive,
  watchEffect,
  watch,
  onMounted,
  onBeforeUnmount,
  onUnmounted
} from "vue";
require("/public/css/ImageList.scss");
const PAGE_STORAGE = "PAGE_STORAGE";
export default defineComponent({
  setup: function() {
    const state: {
      listener: any;
      txt: string;
      imgList: Array<string>;
      tableData: Array<any>;
      showTable: boolean;
      oneRowCount: number;
      pagination: {
        currentPage: string | number;
        pageSizes: Array<string | number>;
        pageSize: number;
        total: string | number;
      };
    } = reactive({
      listener: null,
      txt: "",
      imgList: [],
      tableData: [],
      showTable: false,
      oneRowCount: 5,
      pagination: reactive({
        currentPage: 1,
        pageSizes: [3, 5, 10, 15],
        pageSize: 3,
        total: 0
      })
    });
    const setPageStorage = function() {
      localStorage.setItem(PAGE_STORAGE, state.pagination.currentPage + "");
    };
    const getPageStorage = function() {
      nextTick().then(() => {
        const currentPage = Number(localStorage.getItem(PAGE_STORAGE));
        if (
          currentPage <=
          Math.floor(+state.pagination.total / +state.pagination.pageSize)
        ) {
          state.pagination.currentPage = currentPage || 1;
        }
      });
    };
    const renderTableData = function(list: Array<any>) {
      state.pagination.total = list.length;
      const preCount =
        (+state.pagination.currentPage - 1) * state.pagination.pageSize * state.oneRowCount;
      const tempList = [];
      for (let i = 0; i < state.pagination.pageSize; i++) {
        const start = i * state.oneRowCount + preCount;
        const end = (i + 1) * state.oneRowCount + preCount;
        tempList.push(list.slice(start, end));
      }
      state.tableData = tempList;
    };
    const openFile = function(e: any) {
      const reader = new FileReader();
      reader.readAsText(e.raw);
      reader.onload = oFREvent => {
        // 读取完毕从中取值
        const pointsTxt = oFREvent?.target?.result;
        state.txt = pointsTxt?.toString() || "";
        const reg = /url:(\S*)( )+/g;
        let list: Array<string>;
        list = state.txt.match(reg) || [];
        list = list.map(item => {
          return item.replace("url:", "").replaceAll(" ", "");
        });

        nextTick().then(() => {
          state.imgList = [...list];
          state.showTable = true;
          getPageStorage();
        });
      };
    };
    const handleSizeChange = function(pageSize: any) {
      state.pagination.pageSize = pageSize;
    };
    const handleCurrentChange = function(current: any) {
      state.pagination.currentPage = current;
    };

    onMounted(() => {
      state.listener = document.addEventListener("keydown", e => {
        switch (e.keyCode) {
          case 37:
            if (state.showTable && state.pagination.currentPage > 1) {
              state.pagination.currentPage = +state.pagination.currentPage - 1;
            }
            break;
          case 39:
            if (
              state.showTable &&
              state.pagination.currentPage <=
                Math.floor(+state.pagination.total / +state.pagination.pageSize)
            ) {
              state.pagination.currentPage = +state.pagination.currentPage + 1;
            }
            break;
        }
      });
      window.onbeforeunload = function() {
        setPageStorage();
      };
    });
    onBeforeUnmount(() => {
      window.onbeforeunload = null;
      document.removeEventListener("keydown", state.listener);
    });
    watchEffect(() => {
      renderTableData(state.imgList);
    });
    return () => {
      return (
        <div id="image-list">
          {state.showTable ? (
            <div class="common-container">
              <el-table
                data={state.tableData}
                stripe
                class="table-container"
                height="100vh"
              >
                <el-table-column label="图片" align="center">
                  {{
                    default: ({ row }: any) => (
                      <div class="image-list">
                        {...row.map((item: string | undefined) => (
                          <img class="img-item" src={item} />
                        ))}
                      </div>
                    )
                  }}
                </el-table-column>
              </el-table>
              <div class="pagination-box">
                <el-pagination
                  onSizeChange={handleSizeChange}
                  onCurrentChange={handleCurrentChange}
                  currentPage={state.pagination.currentPage}
                  pageSizes={state.pagination.pageSizes}
                  pageSize={state.pagination.pageSize}
                  layout="total, sizes, prev, pager, next, jumper"
                  total={state.pagination.total}
                />
              </div>
            </div>
          ) : (
            <el-upload
              className="upload-demo"
              drag
              action={""}
              onChange={openFile}
              autoUpload={false}
              multiple
            >
              {{
                default: () => (
                  <div>
                    <i class="el-icon-upload" />
                    <div class="el-upload__text">
                      将文件拖到此处，或<em>点击上传</em>
                    </div>
                  </div>
                )
                // tip: () => (
                //   <div class="el-upload__tip">
                //     只能上传 jpg/png 文件，且不超过 500kb
                //   </div>
                // )
              }}
            </el-upload>
          )}
        </div>
      );
    };
  }
});
