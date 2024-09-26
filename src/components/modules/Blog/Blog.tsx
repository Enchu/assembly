'use client'
import React from 'react';
import './blog.scss'
import {
    Disclosure,
    DisclosureContent,
    DisclosureTrigger,
} from '@/components/core/disclosure';

const Blog = () => {
    return (
        <>
            <div className="container">
                <Disclosure className='w-full rounded-md border border-zinc-200 px-3 dark:border-zinc-700'>
                    <DisclosureTrigger>
                        <div className="px-5 py-3 flex justify-between items-center relative">
                            <div className={'text-lg leading-none m-0 font-semibold relative pr-4'}>Процессор</div>
                            <div className={'flex'}>
                                <button className={'border border-zinc-950/10 rounded-lg m-1 px-2.5 py-1.5 inline-flex items-center justify-center'}>
                                    + | Добавить
                                </button>
                            </div>
                        </div>
                    </DisclosureTrigger>
                    <DisclosureContent>
                        <div className='overflow-hidden pb-3'>
                            <div className='pt-1 font-mono text-sm'>
                                <div className='flex space-x-2'>
                                    <div className='relative w-full'>
                                        <input
                                            className='h-9 w-full rounded-lg border border-zinc-950/10 bg-transparent p-2 text-zinc-900 placeholder-zinc-500 focus:outline-none'
                                            autoFocus
                                            placeholder='Search'
                                        />
                                        <div className='absolute right-1 top-0 flex h-full items-center justify-center'>
                                            123
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </DisclosureContent>
                </Disclosure>
            </div>
        </>
    );
};

export default Blog;
