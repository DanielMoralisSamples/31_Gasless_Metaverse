
login();
const ethers = Moralis.web3Library

async function login(){
    Moralis.Web3.enableWeb3().then(async function (){
        const chainIdHex = await Moralis.switchNetwork("0x2A");
    });
}

async function grantCoupon(){
    const objectType = document.getElementById("objectType").value;
    const objectRank = document.getElementById("objectRank").value;
    const damagePoints = document.getElementById("damagePoints").value;
    const object = {"objectType":objectType,"damagePoints":damagePoints};
    const hash = ethers.utils.hashMessage(JSON.stringify(object));
    const signature = await ethereum.request({
        method: "personal_sign",
        params: [hash, ethereum.selectedAddress],
      });
    const coupon = hash+signature;
    document.getElementById("coupon").value = coupon
}