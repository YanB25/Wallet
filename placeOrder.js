const sonmApi = require('.');
const vasyaCfg = require('./test/data/supercli.json');
const { createSonmFactory } = sonmApi;
const URL_PRIVATE_CHAIN = 'http://sidechain.dds.sysu.tech';

const ZERO_ADDRESS = '0x' + Array(41).join('0');

var placeOrder = async function() {
    const vasyaSidechainClient = createSonmFactory(
        URL_PRIVATE_CHAIN,
        'livenet',
        true,
    );
    var vasyaPrivateKey =
        '0x4dcfde06f6c12ad57eaeb968ff52dc810678a99e85bc2b2379e25bd4b67d5f65';
    var sidechainVASYA = await vasyaSidechainClient.createAccount(
        '0x' + vasyaCfg.address,
    );
    console.log(vasyaCfg.address);
    vasyaSidechainClient.setPrivateKey(vasyaPrivateKey);
    console.log('PART 1');

    // const (
    //     OrderType_ANY OrderType = 0
    //     OrderType_BID OrderType = 1
    //     OrderType_ASK OrderType = 2
    // )
    const res = await sidechainVASYA.createOrder({
        // orderType: 1,
        // price: '123',
        // counterPartyId: ZERO_ADDRESS,
        // duration: 8 * 60 * 60, // in second!
        // identityLevel: 1, // how to match?
        // blacklist: ZERO_ADDRESS,
        // netflags: [true, true, true],
        // tag: 'app',
        // benchmarks: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    });
    console.log('This is my mark');
    console.log(res);
    if (res.status !== '0x0') {
        console.log('place order succeed.');
    }
};

placeOrder();
