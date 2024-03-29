# language: ru

Функционал: CRUD по плану

CRUD по плану

Контекст:
Допустим сервер стартовал
И база данных пуста
И я создаю тестовую единицу измерения
И я ввожу новый ресурс "ресурс1" в систему
И создаю новую работу "работа1" по ресурсу "ресурс1"
И я создаю пользователя
И я создаю тестовый контакт
И я создаю тестовый проект
И я создаю тестовый объект с привязкой к проекту
И я создаю тестовую регистрацию с привязкой к объекту
И я создаю тестовый компонент с привязкой к регистрации
# @new
Сценарий: Создание плана по компоненту
Когда я ввожу план "false" по компоненту
То сервер должен вернуть статус 200
И в ответе новый план
# @new
Сценарий: Получения плана по компоненту
Когда я ввожу план "false" по компоненту
И я ввожу план "true" по компоненту
И запрашиваю список планов по компоненту
То сервер должен вернуть статус 200
И в ответе должен быть объект с двумя свойствами-объектами "JobPlan" и "ResourcePlan"
