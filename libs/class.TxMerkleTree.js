'use strict';

const
    precon = require('@mintpond/mint-precon'),
    buffers = require('@mintpond/mint-utils').buffers,
    pu = require('@mintpond/mint-utils').prototypes;


class TxMerkleTree {

    /**
     * Constructor.
     *
     * @param txHashArr {Buffer[]} Array of hash Buffers excluding coinbase hash.
     */
    constructor(txHashArr) {
        precon.arrayOfInstance(txHashArr, Buffer,'txHashArr');

        const _ = this;
        _._branchBufArr = _._calculateBranchArr(txHashArr);
        _._branchHexArr = _._branchBufArr.map(buf => {
            return buf.toString('hex');
        });
    }


    /**
     * Get the merkle branch needed to complete a merkle root.
     * @returns {Buffer[]}
     */
    get branchBufArr() { return this._branchBufArr; }

    /**
     * Get the merkle branch in hex format.
     * @returns {string[]}
     */
    get branchHexArr() { return this._branchHexArr; }


    /**
     * Generate a merkle root using the specified coinbase hash.
     *
     * @param coinbaseHashBuf {Buffer}
     * @returns {Buffer}
     */
    withFirstHash(coinbaseHashBuf) {
        precon.buffer(coinbaseHashBuf, 'first');

        const _ = this;
        let hashBuf = coinbaseHashBuf;
        _._branchBufArr.forEach(buf => {
            hashBuf = _.$hash(Buffer.concat([hashBuf, buf]));
        });
        return hashBuf;
    }


    /**
     * Generate a merkle hash using the specified coinbase data. The data with be hashed.
     *
     * @param coinbaseBuf {Buffer}
     * @returns {Buffer}
     */
    withFirst(coinbaseBuf) {
        precon.buffer(coinbaseBuf, 'first');

        const _ = this;
        let hashBuf = _.$hash(coinbaseBuf);
        return _.withFirstHash(hashBuf);
    }


    $hash(buf) {
        return buffers.sha256d(buf);
    }


    _calculateBranchArr(txHashArr) {

        const _ = this;

        const branchArr = [];
        if (txHashArr.length === 0)
            return branchArr;

        txHashArr = [null/* Placeholder for coinbase hash */, ...txHashArr];

        let arr = txHashArr;
        let len = txHashArr.length;

        while (len > 1) {

            const nextArr = [null/* placeholder for coinbase hash */];

            // hash serial pairs (skip first pair) and push result into array for next iteration
            for (let i = 2; i < len; i += 2) {
                const pairArr = [arr[i], arr[i + 1] || arr[len - 1]/*duplicate last item if len is uneven*/];
                const hashed = _.$hash(Buffer.concat(pairArr));
                nextArr.push(hashed);
            }

            // push second item of first pair into branch array so the branch can be hashed later
            // with the missing coinbase hash
            branchArr.push(arr[1]);

            arr = nextArr;
            len = nextArr.length;
        }

        return branchArr;
    }


    static [Symbol.hasInstance](obj) {
        return pu.isInstanceOfByName(obj, 'TxMerkleTree') &&
            pu.isFunction(obj.withFirstHash) &&
            pu.isFunction(obj.withFirst) &&
            pu.hasGetters(obj, 'branchBufArr', 'branchHexArr');
    }
}

module.exports = TxMerkleTree;