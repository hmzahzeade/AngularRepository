(function () {
    'use strict';

    // Factory name is handy for logging
    var serviceId = 'model.validation';

    angular.module('app').factory(serviceId, ['common', modelValidation]);

    function modelValidation(common) {
        var entityNames;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(serviceId);
        var Validator = breeze.Validator;
        
        //custom validators
        var requireReferenceValidator;
        var twitterValidator;

        var service = {
            applyValidators: applyValidators, //exposed by model.js ExtendMetadata func
            createAndRegister: createAndRegister //call it from model.js (ConfigureMetadataStore func)
        };

        return service;

        function createAndRegister(eNames) {
            entityNames = eNames;
            // Step 1-  create a breeze validator
            requireReferenceValidator = createRequireReferenceValidator();
            twitterValidator = createTwitterValidator();
            // Step 2 - tell breeze about it
            Validator.register(requireReferenceValidator);
            Validator.register(twitterValidator);
            // Step 3: later on, we'll apply it to client model in model.js
            log('Validators created and registered', null, serviceId, false);
        }

        function applyValidators(metadataStore) {
            applyRequireReferenceValidators(metadataStore);
            applyTwitterValidators(metadataStore);
            applyEmailValidators(metadataStore);
            applyUrlValidators(metadataStore);
            
            log('Validators applied', null, serviceId);
        }

        function applyTwitterValidators(metadataStore) {
            var entityType = metadataStore.getEntityType(entityNames.speaker);
            entityType.getProperty('twitter').validators
                .push(twitterValidator); 
        }

        function applyEmailValidators(metadataStore) {
            var entityType = metadataStore.getEntityType(entityNames.speaker);
            entityType.getProperty('email').validators
                .push(Validator.emailAddress()); //out of the breeze box validators
        }
        
        function applyUrlValidators(metadataStore) {
            var entityType = metadataStore.getEntityType(entityNames.speaker);
            entityType.getProperty('blog').validators
                .push(Validator.url()); //out of the breeze box validators
        }

        function createRequireReferenceValidator() {
            var name = 'requireReferenceValidato';
            var context = {
                messageTemplate: 'Missing %displayName%',
                isRequired: true //will set a flag with astra next to field
            };

            var val = new Validator(name, valFunction, context);
            return val;

            function valFunction(value) {
                return value ? value.id !== 0 : false;
            }
        }

        function applyRequireReferenceValidators(metadataStore) {
            var navigations = ['room', 'track', 'timeSlot', 'speaker'];
            var entityType = metadataStore.getEntityType(entityNames.session);

            navigations.forEach(function (propertyName) {
                entityType.getProperty(propertyName).validators
                    .push(requireReferenceValidator);
            });
        }
        
        //twitter validator
        function createTwitterValidator() {
            var val = Validator.makeRegExpValidator(
                'twitter',
                /^@([a-zA-Z]+)([a-zA-Z0-9_]+)$/,
                "Invalid Twitter User Name: '%value%'"
            );
            return val;
        }
    }
})();