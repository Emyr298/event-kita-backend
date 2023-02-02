import { Request, Response, NextFunction } from 'express';
import fbApp from '../utils/firebaseApp';
import { User, anonymousUser } from '../types/User';

// export async function authMiddleware(
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ) {
//   const tokenHeader = req.headers.authorization;
//   if (tokenHeader) {
//     const token = tokenHeader.replace('Bearer ', '');
//     const decodedIdToken = await fbApp.auth().verifyIdToken(token);

//   }

//   if (idToken != null && idToken != '') {
//     fbApp
//       .auth()
//       .verifyIdToken(idToken.replace('Bearer ', ''))
//       .then((decodedIdToken) => {
//         const uid = decodedIdToken.uid;
//         fbApp
//           .auth()
//           .getUser(uid)
//           .then((user) => {
//             const userInstance: User = {
//               displayName: user.displayName,
//               email: user.email,
//               isAnonymous: false,
//               photoURL: user.photoURL,
//               uid: user.uid,
//             };
//             console.log(`Logged In as ${userInstance.displayName}`);
//             req['user'] = userInstance;
//             next();
//           })
//           .catch(() => {
//             req['user'] = anonymousUser;
//             next();
//           });
//       })
//       .catch(() => {
//         req['user'] = anonymousUser;
//         next();
//       });
//   } else {
//     console.log('Logged In as Anonymous 3');
//     req['user'] = anonymousUser;
//     next();
//   }
// }

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const idToken = req.headers.authorization;
  if (idToken != null && idToken != '') {
    fbApp
      .auth()
      .verifyIdToken(idToken.replace('Bearer ', ''))
      .then((decodedIdToken) => {
        const uid = decodedIdToken.uid;
        fbApp
          .auth()
          .getUser(uid)
          .then((user) => {
            const userInstance: User = {
              displayName: user.displayName,
              email: user.email,
              isAnonymous: false,
              photoURL: user.photoURL,
              uid: user.uid,
            };
            console.log(`Logged In as ${userInstance.displayName}`);
            req['user'] = userInstance;
            next();
          })
          .catch(() => {
            req['user'] = anonymousUser;
            next();
          });
      })
      .catch(() => {
        req['user'] = anonymousUser;
        next();
      });
  } else {
    console.log('Logged In as Anonymous 3');
    req['user'] = anonymousUser;
    next();
  }
}
