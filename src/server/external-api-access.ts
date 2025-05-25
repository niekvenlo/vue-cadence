import type { ConnectionsEntry } from './db-access'

export const getNYConn = async ({
  year,
  month,
  date
}: {
  year: number | string | undefined
  month: number | string | undefined
  date: number | string | undefined
}) => {
  try {
    if (!year || !month || !date) {
      return { error: 'Whoopsy: Date missing' }
    }
    // query param `game` should be in the American DD-MM-YYYY format
    const response = await fetch(
      `https://connectionsgame.org/get/getdaily.php?game=${date}-${month}-${year}`,
      {
        credentials: 'include',
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:138.0) Gecko/20100101 Firefox/138.0',
          Accept: '*/*',
          'Accept-Language': 'en-US,en;q=0.5',
          'Alt-Used': 'connectionsgame.org',
          'Sec-Fetch-Dest': 'empty',
          'Sec-Fetch-Mode': 'cors',
          'Sec-Fetch-Site': 'same-origin'
        },
        referrer: 'https://connectionsgame.org/?game=22-05-2025',
        method: 'GET',
        mode: 'cors'
      }
    )
    const json = await response.json()
    return json as ConnectionsEntry
  } catch {
    return { error: 'Whoopsy: Could not fetch data' }
  }
}
