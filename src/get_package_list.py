import contextlib
from datetime import timedelta

import joblib
from joblib import Parallel, delayed
from requests_cache import CachedSession
from tqdm import tqdm

session = CachedSession(
    'steam_cache',
    use_cache_dir=True,
    cache_control=False,
    expire_after=timedelta(days=1),
    allowable_methods=['GET'],
    allowable_codes=[200],
    match_headers=False,
    stale_if_error=False,
)


@contextlib.contextmanager
def tqdm_joblib(tqdm_object):
	"""Context manager to patch joblib to report into tqdm progress bar given as argument"""

	class TqdmBatchCompletionCallback(joblib.parallel.BatchCompletionCallBack):

		def __call__(self, *args, **kwargs):
			tqdm_object.update(n=self.batch_size)
			return super().__call__(*args, **kwargs)

	old_batch_callback = joblib.parallel.BatchCompletionCallBack
	joblib.parallel.BatchCompletionCallBack = TqdmBatchCompletionCallback
	try:
		yield tqdm_object
	finally:
		joblib.parallel.BatchCompletionCallBack = old_batch_callback
		tqdm_object.close()


def checkGame(game):
	session = CachedSession(
	    'steam_cache',
	    use_cache_dir=True,
	    cache_control=False,
	    expire_after=timedelta(days=1),
	    allowable_methods=['GET'],
	    allowable_codes=[200],
	    match_headers=False,
	    stale_if_error=False,
	)
	try:
		res = session.get(
		    url='https://store.steampowered.com/api/appdetails/?appids=' +
		    str(game) + '&cc=EE&l=english&v=1',
		    proxies={
		        'http': f'socks5h://p.webshare.io:9999',
		        'https': f'socks5h://p.webshare.io:9999'
		    })
	except Exception as e:
		print('\nGot exception while trying to send request %s' % e)
		return checkGame(game)

	if res.status_code != 200:
		print('\nGot wrong status code %d' % res.status_code)
		return checkGame(game)

	try:
		res = res.json()
	except Exception as e:
		# print('\nGot exception while trying to decode JSON %s' % e)
		return None

	if res is None:
		print('\nGot invalid response %d' % game)
		return checkGame(game)

	if res[str(game)]['success'] is False:
		# print('\nGot invalid app %d' % game)
		return None
  
  if res[str(game)]['data']['release_date']['coming_soon'] is True:
    # print('\nGot not yet released app %d' % game)
    return None

	if res[str(game)]['data']['is_free'] is True:
		# print('\nGot free app %d' % game)
		return game

	elif res[str(game)]['data']['is_free'] is False:
		# print('\nGot paid app %d' % game)
		return None

	print('Got faulty response %s' % res)
	return None


res = session.get(
    url='http://api.steampowered.com/ISteamApps/GetAppList/v2').json()

apps = []
for app in res['applist']['apps']:
	apps.append(app['appid'])

print('Received %d apps' % len(apps))

with tqdm_joblib(tqdm(desc='Requesting app statuses',
                      total=len(apps))) as progress_bar:
	results = Parallel(n_jobs=60)(delayed(checkGame)(i) for i in apps)

output = ''
for game in results:
	if game is not None:
		output += str(game) + ','
output = output[:-1]

with open('package_list.txt', 'w') as f:
	f.write(output)
