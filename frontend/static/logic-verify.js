login();

const protocolContract = "";//your contract address here
const protocolABI = [{"anonymous":false,"inputs":[{"indexed":false,"internalType":"bytes32","name":"hashedMessage","type":"bytes32"},{"indexed":false,"internalType":"address","name":"claimant","type":"address"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"CouponClaimed","type":"event"},{"inputs":[{"internalType":"bytes32","name":"_hashedMessage","type":"bytes32"},{"internalType":"uint8","name":"_v","type":"uint8"},{"internalType":"bytes32","name":"_r","type":"bytes32"},{"internalType":"bytes32","name":"_s","type":"bytes32"}],"name":"claimCoupon","outputs":[],"stateMutability":"nonpayable","type":"function"}]

async function login(){
    Moralis.Web3.enableWeb3().then(async function (){
        const chainIdHex = await Moralis.switchNetwork("0x2A");
    });
}

function splitCoupon(coupon){
    const hash = coupon.slice(0,66);
    const signature = coupon.slice(66, coupon.length);
    const r = signature.slice(0, 66);
    const s = "0x" + signature.slice(66, 130);
    const v = parseInt(signature.slice(130, 132), 16);
    signatureParts = { r, s, v };
    console.log([hash,signatureParts])
    return ([hash,signatureParts]);
}

async function verify(){
    const coupon = document.getElementById("coupon").value;
    const couponParts = splitCoupon(coupon);
    const hash = couponParts[0]
    const signature = couponParts[1]
    const contractOptions = {
        contractAddress: protocolContract,
        abi: protocolABI,
        functionName: "claimCoupon",
        params: {
            _hashedMessage: hash,
            _r:signature["r"],
            _s:signature["s"],
            _v:signature["v"]
        }
    }
    try{
        const transaction = await Moralis.executeFunction(contractOptions);
        await transaction.wait();
        displayMessage("00","Transaction confirmed with hash "+transaction.hash);
    }
    catch(error){
        displayMessage("01","Transaction reverted see console for details");
        console.log(error)
    }
}

function displayMessage(messageType, message){
    messages = {
        "00":`<div class= "alert alert-success"> ${message} </div>`,
        "01":`<div class= "alert alert-danger"> ${message} </div>`
    }
    document.getElementById("notifications").innerHTML = messages[messageType];
}