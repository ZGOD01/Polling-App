import React from 'react';
import moment from 'moment';
import CharAvtar from './CharAvtar'; 

const UserProfileInfo = ({ imgUrl, fullName = '', username, createdAt }) => {
    return (
        <div className='flex items-center gap-4'>
            {imgUrl ? (
                <img src={imgUrl} alt='Profile' className='w-10 h-10 rounded-full border-none'  />
            ) : (
                <CharAvtar fullName={fullName} width="w-10" height="h-10" style="text-sm" />
            )}

            <div>
                <p className='text-sm text-black font-medium leading-4'>
                    {fullName} <span className='mx-1 text-sm text-slate-500'>•</span>
                    <span className='text-[10px] text-slate-500'>
                        {createdAt && moment(createdAt).fromNow()}
                    </span>
                </p>
                <span className='text-[11.5px] text-slate-500 leading-4'>
                    @{username}
                </span>
            </div>
        </div>
    );
};

export default UserProfileInfo;
