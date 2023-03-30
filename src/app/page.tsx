import clsx from 'clsx';

export default function Home() {
	return (
		<div>
			<h1 className={clsx(
				'text-4xl font-bold text-yellow-600',
				'sm:text-2xl sm:font-light',
        'lg:text-6xl lg:font-bold lg:text-pink-600',
			)} >hello</h1>
			<p className='text-4xl text-red-500'>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Numquam quos, sequi maxime suscipit quod earum illo unde minus perspiciatis impedit.</p>
      <p>salut les gens</p>
		</div>
	);
}
