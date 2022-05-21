import Head from 'next/head';

const SocialButtons = () => {
	const socials = [];

	return (
		<>
			<Head>
				<link
					href='https://unpkg.com/boxicons@2.1.2/css/boxicons.min.css'
					rel='stylesheet'
				/>
			</Head>
			<div id='socialButtons'>
				<button>
					<a href=''>
						<i className='bx bx-globe'></i>
					</a>
				</button>
				<button>
					<a href=''>
						<i className='bx bxl-github'></i>
					</a>
				</button>
				<button>
					<a href=''>
						<i className='bx bxl-twitter'></i>
					</a>
				</button>
				<button>
					<a href=''>
						<i className='bx bxl-mastodon'></i>
					</a>
				</button>
				<button>
					<a href=''>
						<i className='bx bxl-instagram-alt'></i>
					</a>
				</button>
			</div>
		</>
	);
};

export default SocialButtons;
