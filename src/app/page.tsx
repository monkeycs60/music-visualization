'use client';

import clsx from 'clsx';

export default function Home() {
	return (
		<div>
			<h1 className={clsx(
				'text-4xl font-bold text-yellow-600',
				'sm:text-2xl sm:font-light',
        		'lg:text-6xl lg:font-bold lg:text-pink-600',
			)} >hello</h1>
		</div>
	);
}
