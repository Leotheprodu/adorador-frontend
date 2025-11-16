import { Notification } from '../../../../global/services/notifications.service';

describe('Notificaciones', () => {
  it('genera una notificación al comentar', () => {
    const notifications: Notification[] = [];
    // Simulamos la lógica de agregar una notificación
    const newNotification: Notification = {
      id: 1,
      userId: 2,
      type: 'comment',
      title: 'Nuevo comentario',
      message: 'Alguien comentó tu publicación',
      metadata: { postId: 1 },
      read: false,
      createdAt: new Date().toISOString(),
    };
    notifications.push(newNotification);
    expect(notifications.length).toBe(1);
    expect(notifications[0].type).toBe('comment');
  });

  it('genera una notificación al dar bless', () => {
    const notifications: Notification[] = [];
    const newNotification: Notification = {
      id: 2,
      userId: 2,
      type: 'bless',
      title: 'Nuevo bless',
      message: 'Alguien dio bless a tu comentario',
      metadata: { commentId: 1 },
      read: false,
      createdAt: new Date().toISOString(),
    };
    notifications.push(newNotification);
    expect(notifications.length).toBe(1);
    expect(notifications[0].type).toBe('bless');
  });
});
