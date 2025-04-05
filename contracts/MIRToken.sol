// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MIRToken is ERC20, ERC20Burnable, Ownable {
    // トークンの初期供給量: 1,000,000 MIR (18桁の小数点を考慮)
    uint256 private constant INITIAL_SUPPLY = 1_000_000 * 10**18;

    /**
     * @dev コンストラクタ
     * @param initialOwner 初期所有者アドレス
     */
    constructor(address initialOwner) 
        ERC20("MIR Token", "MIR") 
        Ownable(initialOwner) 
    {
        // 初期供給量をコントラクトのデプロイヤーに割り当て
        _mint(initialOwner, INITIAL_SUPPLY);
    }

    /**
     * @dev オーナーだけが追加のトークンを鋳造できる機能
     * @param to 受け取り手のアドレス
     * @param amount 鋳造する量
     */
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
} 