import { defineComponent, reactive } from "vue";
import XLSX from "xlsx";
import any = jasmine.any;
require("./formatJson.scss");

interface JsonNeed {
  brand: string;
  type: string;
  phone: string;
  model: Array<string>;
  modelName: string;
  brandName: string;
  energyEfficiencyIndex?: string;
}
export default defineComponent({
  setup() {
    const state: {
      wb: any;
      xlsxJson: any;
      SearchData: Array<any>;
      BrandData: Array<any>;
      TypeData: Array<any>;
    } = reactive({
      wb: null,
      xlsxJson: null,
      SearchData: [],
      BrandData: [],
      TypeData: []
    });
    const formatJson = (list: Array<any>) => {
      const step1: Array<any> = [];
      let step2: Array<any> = [];
      let step3: Array<any> = [];
      const step4: Array<any> = [];
      let step5: Array<any> = [];
      list.forEach(item => {
        step1.push(...item.sheet);
      });
      step2 = step1.map(item => {
        const brandReg = /品牌/i;
        const typeReg = /种类/i;
        const phoneReg = /报修电话/i;
        const modelReg = /model/i;
        const brandNameReg = /生产厂家/i;
        const energyEfficiencyIndexReg = /能效等级/i;
        const rst: JsonNeed = {
          brand: "",
          type: "",
          phone: "",
          model: [],
          modelName: "",
          brandName: "",
          energyEfficiencyIndex: ""
        };
        Object.keys(item).forEach(key => {
          if (brandReg.test(key)) {
            rst.brand = item[key].toString().trim();
          } else if (typeReg.test(key)) {
            rst.type = item[key].toString().trim();
          } else if (phoneReg.test(key)) {
            rst.phone = item[key].toString().trim();
          } else if (modelReg.test(key)) {
            const modelReplaceReg = /model:(\S*)/;
            const matchList = key.match(modelReplaceReg);
            const modelName =
              Array.isArray(matchList) && matchList.length > 1
                ? matchList[1] + " "
                : "";
            rst.modelName = modelName === " " ? "" : modelName;
            rst.model = item[key].split("、").map((item: string) => item.trim());
          } else if (brandNameReg.test(key)) {
            rst.brandName = item[key].toString().trim();
          } else if (energyEfficiencyIndexReg.test(key)) {
            rst.energyEfficiencyIndex = item[key].toString().trim();
          }
        });
        return rst;
      });
      step3 = step2.filter(item => item.model.length > 0 && item.brand.length > 0);
      step3.forEach(item => {
        item.model.forEach((model:string) => {
          const rst = Object.assign({},item);
          rst.model = item.modelName + model;
          step4.push(rst);
        });
      });
      step5 = step4.map(item => {
        delete item.modelName;
        return item;
      });
      state.SearchData = step5;
      state.TypeData = [
        "全部",
        ...Array.from(new Set(step5.map(item => item.type))).sort()
      ];
      state.BrandData = [
        "全部",
        ...Array.from(new Set(step5.map(item => item.brand))).sort()
      ];
    };
    const file2Xce = (file: any) => {
      return new Promise(function(resolve, reject) {
        const reader = new FileReader();
        reader.readAsBinaryString(file.raw);
        reader.onload = function(e: any) {
          const data = e.target.result;
          state.wb = XLSX.read(data, {
            type: "binary"
          });
          const result: Array<any> = [];
          state.wb.SheetNames.forEach((sheetName: any) => {
            result.push({
              sheetName: sheetName,
              sheet: XLSX.utils.sheet_to_json(state.wb.Sheets[sheetName])
            });
          });
          resolve(result);
        };
      });
    };
    const importExcel = (file: any) => {
      const types = file.name.split(".")[1];
      const fileType = ["xlsx", "xlc", "xlm", "xls", "xlt", "xlw", "csv"].some(
        item => item === types
      );
      if (!fileType) {
        alert("格式错误！请重新选择");
        return;
      }
      file2Xce(file).then((tabJson: any) => {
        if (tabJson && tabJson.length > 0) {
          state.xlsxJson = tabJson;
          formatJson(state.xlsxJson);
          // console.log(state.SearchData)
          console.log("TypeData", JSON.stringify(state.TypeData));
          console.log("BrandData", JSON.stringify(state.BrandData));
          console.log("SearchData", JSON.stringify(state.SearchData));
        }
      });
    };

    return () => {
      return (
        <div id="formatJson">
          <el-upload
            ref="upload"
            accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            drag
            action="/"
            onChange={importExcel}
            autoUpload={false}
            showFileList={false}
          >
            {{
              default: () => (
                <div>
                  <i class="el-icon-upload" />
                  <div class="el-upload__text">
                    将文件拖到此处，或<em>点击上传</em>
                  </div>
                </div>
              ),
              tip: () => <div class="el-upload__tip">上传表格类型文件</div>
            }}
          </el-upload>
        </div>
      );
    };
  }
});
