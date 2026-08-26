import React from 'react';

// Hapus prop 'onDelete' dan 'iconTrash'
const WalletCard = ({ logo, name, type, balance, norek, account_name, onEdit, iconEdit = "/assets/boxicons_edit-filled.svg" }) => (
    <div className="relative flex flex-col items-start p-[14px] gap-[7px] w-[208px] h-[191px] rounded-[18px] bg-[#D9D9D9] shadow-sm flex-shrink-0 font-inter">
        
        {/* Ikon Edit di Pojok Kanan Atas - Cuma satu ikon sekarang */}
        <div className="absolute top-[5px] right-[20px] w-[31.6px] h-[31.6px]">
            <img 
                src={iconEdit} 
                alt="edit" 
                className="w-full h-full cursor-pointer hover:opacity-80 transition-opacity" 
                onClick={onEdit} 
            />
        </div>

        {/* Header: Logo, Tipe, Nama */}
        <div className="flex flex-row items-center gap-4">
            <div 
                className="w-[54px] h-[54px] rounded-[30px] bg-cover bg-center bg-white border border-gray-100 flex-shrink-0"
                style={{ backgroundImage: `url('${logo}')` }}
            ></div>
            <div className="flex flex-col text-left">
                <p className="text-black text-[8px] font-normal leading-none mb-1 opacity-70 uppercase">{type}</p>
                <h4 className="text-black text-[22px] font-semibold leading-[1.1] w-[110px] break-words">
                    {name}
                </h4>
            </div>
        </div>

        {/* Body: Info & Saldo */}
        <div className="flex flex-col text-left mt-auto w-full gap-1">
            <p className="text-black text-[12px] font-normal truncate w-[180px]">
                {account_name || 'Tanpa Nama'}
            </p>
            {/* Pakai balance format ribuan yang dikirim dari Index */}
            <p className="text-black text-[24px] font-bold leading-none truncate">Rp.{balance}</p>
            <p className="text-black text-[12px] font-normal opacity-60">No rek {norek}</p>
        </div>
    </div>
);

export default WalletCard;