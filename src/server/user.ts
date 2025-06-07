// PRETEND THIS IS NOT IN THE REPO, of course.
const userLookup = <{ uuid: string; code: string; pw: string }[]>[
  { code: 'us', pw: '471', uuid: '228efd89-593e-4d74-b56c-2509fd541b6b' },
  { code: 'nb', pw: '7', uuid: '26a55703-e472-43ee-b73e-dfa30eb641f5' },
  { code: 'gg', pw: '19', uuid: 'b20b2eea-9f2f-4489-8a88-117720d77c0b' }
]

export const getUserByUuid = (uuid: string) => userLookup.find((user) => user.uuid === uuid)
export const getUserByPw = (pw?: string) => userLookup.find((user) => user.pw === pw)
