const chalk = require("chalk");

const BoardingPlacesStore = require("../components/lugaresEmbarque/store");
const BoardingPlacesModel = require("../components/lugaresEmbarque/model");
const dataBoardingPlaces = require("../dataInitial/boardingPlaces");

const DataTypeStore = require("../components/tipoDato/store");
const DataTypeModel = require("../components/tipoDato/model");
const dataDataType = require("../dataInitial/dataType");

const DocumentTypeStore = require("../components/tipoDocumento/store");
const DocumentTypeModel = require("../components/tipoDocumento/model");
const dataDocumentType = require("../dataInitial/documentTye");

const GeographicalAreaStore = require("../components/zonaGeografica/store");
const GeographicalAreaModel = require("../components/zonaGeografica/model");
const dataGeographicalArea = require("../dataInitial/geographicalArea");

const PaymentTypeStore = require("../components/tipoCobro/store");
const PaymentTypeModel = require("../components/tipoCobro/model");
const dataPaymenType = require("../dataInitial/paymentType");

const StatePackageStore = require("../components/estadoPaquete/store");
const StatePackageModel = require("../components/estadoPaquete/model");
const dataStatePackage = require("../dataInitial/statePackage");

const StateSaleStore = require("../components/estadoVenta/store");
const StateSaleModel = require("../components/estadoVenta/model");
const dataSateSale = require("../dataInitial/stateSale");

const UserStore = require("../components/usuario/store");
const UserModel = require("../components/usuario/model");
const dataUser = require("../dataInitial/user");

const setInitialData = async () => {
  console.log(chalk.yellowBright("Configuration Initial..."));
  if ((await UserModel.find()).length === 0) {
    //
    for (let index = 0; index < dataUser.length; index++) {
      await UserStore.add(dataUser[index]);
    }
    console.info(chalk.greenBright("[Insert to DB] => Usuarios cargados..."));
  }

  if ((await BoardingPlacesModel.find()).length === 0) {
    //
    for (let index = 0; index < dataBoardingPlaces.length; index++) {
      await BoardingPlacesStore.createLugarEmbarque(dataBoardingPlaces[index]);
    }
    console.info(
      chalk.greenBright("[Insert to DB] => Lugares Embarque cargados...")
    );
  }

  if ((await DataTypeModel.find()).length === 0) {
    //
    for (let index = 0; index < dataDataType.length; index++) {
      await DataTypeStore.add(dataDataType[index]);
    }
    console.info(chalk.greenBright("[Insert to DB] => Tipo Dato cargados..."));
  }

  if ((await DocumentTypeModel.find()).length === 0) {
    //
    for (let index = 0; index < dataDocumentType.length; index++) {
      await DocumentTypeStore.createTipoDocumento(dataDocumentType[index]);
    }
    console.info(
      chalk.greenBright("[Insert to DB] => Tipos Documento cargados...")
    );
  }

  if ((await GeographicalAreaModel.find()).length === 0) {
    //
    for (let index = 0; index < dataGeographicalArea.length; index++) {
      await GeographicalAreaStore.add(dataGeographicalArea[index]);
    }
    console.info(
      chalk.greenBright("[Insert to DB] => Zonas Geograficas cargadas...")
    );
  }

  if ((await PaymentTypeModel.find()).length === 0) {
    //
    for (let index = 0; index < dataPaymenType.length; index++) {
      await PaymentTypeStore.add(dataPaymenType[index]);
    }
    console.info(
      chalk.greenBright("[Insert to DB] => Tipos de Cobro cargados...")
    );
  }

  if ((await StatePackageModel.find()).length === 0) {
    //
    for (let index = 0; index < dataStatePackage.length; index++) {
      await StatePackageStore.add(dataStatePackage[index]);
    }
    console.info(
      chalk.greenBright("[Insert to DB] => Estado de paquete cargados...")
    );
  }

  if ((await StateSaleModel.find()).length === 0) {
    //
    for (let index = 0; index < dataSateSale.length; index++) {
      await StateSaleStore.add(dataSateSale[index]);
    }
    console.info(
      chalk.greenBright("[Insert to DB] => Estados Venta cargados...")
    );
  }
};

module.exports = setInitialData;
