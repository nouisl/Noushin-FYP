import { Icon, Modal, Card } from "web3uikit";
import { useState, useEffect } from "react";
import { useMoralis } from "react-moralis";

function User ({account}) {

  const [isVisible, setVisible] = useState(false);
  const { Moralis } = useMoralis();
  const [userDB, setUserDB] = useState();

  useEffect(() => {

    async function fetchDB() {
      const Dashboard = Moralis.Object.extend("newTransaction");
      const query = new Moralis.Query(Dashboard);
      query.equalTo("customer", account);
      const result = await query.find();

      setUserDB(result);
    }

    fetchDB();

  }, [isVisible]);


  return (
    <>
      <div onClick={() => setVisible(true)}>
        {/* <Icon fill="#000000" size={24} svg="user" /> */}
      </div>

      <Modal
        onCloseButtonPressed={() => setVisible(false)}
        hasFooter={false}
        title="Your Stays"
        isVisible={isVisible}
      >
        <div style={{display:"flex", justifyContent:"start", flexWrap:"wrap", gap:"10px"}}>
         {userDB &&
          userDB.map((e)=>{
            return(
              <div style={{ width: "200px" }}>
                <Card
                  isDisabled
                  title={e.attributes.artist}
                  description={e.attributes.size}
                >
                  <div>
                    <img
                      width="180px"
                      src={e.attributes.imgUrl}
                    />
                  </div>
                </Card>
              </div>
            )
          })

         }
        </div>
      </Modal>
    </>
  );
}

export default User;