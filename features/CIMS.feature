            #language: ru

            Функционал: Загрузка дампа

            Хочу чтобы загружался дамп

            Контекст:
            Допустим сервер стартовал
            И база данных пуста
            И я создаю пользователя
            И я создаю тестовый проект
            И я создаю тестовую единицу измерения
            # @new
            Сценарий: Успешная загрузка (EXCEL)
            Допустим я ввожу новый ресурс "ресурс1" в систему
            И я ввожу новый ресурс "ресурс2" в систему
            И создаю новую работу "работа1" по ресурсу "ресурс1"
            И создаю новую работу "работа2" по ресурсу "ресурс2"
            Когда я загружаю файл excel с данными
            То сервер должен вернуть статус 200
            И вернуть ответ "ok"
            И в базе появились следующие записи
            | Table     | Field         | Value                                                                  | Index |
            | Contact   | GivenName     | Иван                                                               | 0     |
            | Contact   | GivenName     | Петр                                                               | 1     |
            | Facility  | FacilityName  | Многоквартирный жилой дом                       | 0     |
            | Floor     | FloorName     | Паркинг                                                         | 0     |
            | Floor     | FloorName     | Кровля                                                           | 11    |
            | Space     | SpaceName     | ПА                                                                   | 0     |
            | Space     | SpaceName     | КВ                                                                   | 38    |
            | System    | SystemName    | Конструкции                                                 | 0     |
            | System    | SystemName    | Монтаж вспомогательного оборудования | 11    |
            | Register  | ProductType   | Наружные стены                                            | 0     |
            | Register  | ProductType   | Сантехника                                                   | 11    |
            | Component | ComponentName | Ст-1                                                                 | 0     |
            | Component | ComponentName | ОК-14                                                                | 25    |
И появились плановые данные по компонентам
И появились фактические данные по компонентам

# @new
# Сценарий: Формирование списка ресурсов для файла ЦИМС
# Когда я ввожу новый ресурс "ресурс1" в систему
# И я ввожу новый ресурс "ресурс2" в систему
# То сервер должен вернуть статус 200
# И в файле шаблона ЦИМС на странице с ресурсами должны быть 2 записи
# @new
# Сценарий: Обновление файла со списком ресурсов
# Допустим я ввожу новый ресурс "ресурс1" в систему
# И я ввожу новый ресурс "ресурс2" в систему
# Когда я делаю запрос на файл со списком ресурсов
# То сервер должен вернуть статус 200
# И в файле со списком ресурсов есть 2 записи

# @new
Сценарий: Неуспешная загрузка (EXCEL)
Допустим я ввожу новый ресурс "ресурс1" в систему
И я ввожу новый ресурс "ресурс2" в систему
Когда я загружаю файл excel с некорректными данными
То сервер должен вернуть статус 400
И в базе нет объектов и контактов

