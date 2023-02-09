import './styles/Dashboard.css';
import Header from "../components/Header";
import Footer from "../components/Footer";
import User from "../components/User";
import { Link } from "react-router-dom";
import { useState, useEffect} from "react";
import { useLocation } from "react-router";
import { ConnectButton, Button, useNotification } from "web3uikit";
// import RentalsMap from "../components/RentalsMap";
import { useMoralis, useWeb3ExecuteFunction } from "react-moralis";

function Dashboard() {
  const { state: searchFilters } = useLocation();
  const [highLight, setHighLight] = useState();
  const { Moralis, account } = useMoralis();
  const [DBList, setDBList] = useState();
  const [coordinates, setCoordinates] = useState([]);
  const contractProcessor = useWeb3ExecuteFunction();
  const dispatch = useNotification();

  const handleSuccess = () => {
    dispatch({
      type: "success",
      message: `Nice! You are going to ${searchFilters.artist} in size ${searchFilters.size}!!`,
      title: "Transaction Succesful",
      position: "topL",
    });
  };

  const handleError = (msg) => {
    dispatch({
      type: "error",
      message: `${msg}`,
      title: "Transaction Failed",
      position: "topL",
    });
  };

  const handleNoAccount = () => {
    dispatch({
      type: "error",
      message: `You need to connect your wallet to buy a product.`,
      title: "Not Connected",
      position: "topL",
    });
  };

  useEffect(() => {
    async function fetchDBList() {
      const Dashboard = Moralis.Object.extend("Dashboard");
      const query = new Moralis.Query(Dashboard);
      query.equalTo("name", searchFilters.artist);
      query.equalTo("size", searchFilters.size);

      const result = await query.find();

      let cords = [];
      result.forEach((e) => {
        cords.push({ lat: e.attributes.lat, lng: e.attributes.long });
      });

      setCoordinates(cords);
      setDBList(result);
    }

    fetchDBList();
  }, [searchFilters]);

  // const buy = async function (id, price) {
    
  //   for (
  //     var arr = [], dt = new Date(start);
  //     dt <= end;
  //     dt.setDate(dt.getDate() + 1)
  //   ) {
  //     arr.push(new Date(dt).toISOString().slice(0, 10)); // yyyy-mm-dd
  //   }

  //   let options = {
  //     contractAddress: "0xa9110224Df672c266569931F4e03f009651149E6",
  //     functionName: "addDatesBooked",
  //     abi: [
  //       {
  //         "inputs": [
  //           {
  //             "internalType": "uint256",
  //             "name": "id",
  //             "type": "uint256"
  //           },
  //           {
  //             "internalType": "string[]",
  //             "name": "newBookings",
  //             "type": "string[]"
  //           }
  //         ],
  //         "name": "addDatesBooked",
  //         "outputs": [],
  //         "stateMutability": "payable",
  //         "type": "function"
  //       }
  //     ],
  //     params: {
  //       id: id,
  //       newBookings: arr,
  //     },
  //     msgValue: Moralis.Units.ETH(dayPrice * arr.length),
  //   }
  //   console.log(arr);

  //   await contractProcessor.fetch({
  //     params: options,
  //     onSuccess: () => {
  //       handleSuccess();
  //     },
  //     onError: (error) => {
  //       handleError(error.data.message)
  //     }
  //   });

  // }

  return (
    <>
      <Header />
      <div className="column">
        <p></p>
        <h1>THIS IS DASHBOARD</h1>
        <div className="container">
          
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Dashboard;

